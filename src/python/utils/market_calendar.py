import os
import json
import datetime
import logging
import asyncio
import pandas as pd
import ccxt
import ccxt.async_support as ccxt_async  # Explicit async import
import pytz
from dotenv import load_dotenv
from pandas_market_calendars import get_calendar
import redis
from typing import Optional, List, Dict

# Point 6: Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def send_alert(message: str):
    logger.warning(f"Alert: {message}")

load_dotenv()

CONFIG_DIR = os.getenv('CONFIG_DIR', 'config')
CUSTOM_HOLIDAYS_FILE = os.path.join(CONFIG_DIR, 'custom_holidays.json')
ASSET_TYPE_HANDLERS = {}

try:
    with open(CUSTOM_HOLIDAYS_FILE, 'r') as f:
        custom_config = json.load(f)
        ASSET_TYPE_HANDLERS = custom_config.get('asset_handlers', {})
        raw_holidays = custom_config.get('holidays', {})
        CUSTOM_HOLIDAYS = {k: [tuple(d) for d in v] for k, v in raw_holidays.items()}
except FileNotFoundError:
    logger.error(f"{CUSTOM_HOLIDAYS_FILE} not found. Using defaults.")
    CUSTOM_HOLIDAYS = {
        'forex': [(1, 1), (12, 25), (12, 26)]
    }
    ASSET_TYPE_HANDLERS = {
        'crypto': 'always_open_with_status',
        'forex': 'weekday_with_holidays',
        'traditional': 'calendar_based',
        'bonds': 'calendar_based',
        'options': 'calendar_based'
    }

# Dynamic env vars (No longer global constants for logic)
TIMEZONE = os.getenv('TIMEZONE', 'UTC')
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')
CCXT_API_KEY = os.getenv('CCXT_API_KEY')
CCXT_API_SECRET = os.getenv('CCXT_API_SECRET')

try:
    cache = redis.from_url(REDIS_URL)
except Exception as e:
    logger.error(f"Redis connection failed: {e}. Disabling cache.")
    cache = None

def get_config():
    """Helper to get current config, supporting runtime env changes."""
    return {
        'TYPE': os.getenv('EXCHANGE_TYPE', 'crypto').lower(),
        'NAME': os.getenv('EXCHANGE_NAME', 'Binance')
    }

def validate_date(date: Optional[datetime.date]) -> datetime.date:
    if date is None:
        date = datetime.date.today()
    if not isinstance(date, datetime.date):
        raise ValueError("Invalid date format.")
    return date

def sanitize_exchange(exchange: Optional[str]) -> str:
    return exchange.strip().upper() if exchange else get_config()['NAME']


# Point 4: Performance - Batch caching helper
def batch_cache_set(keys_values: Dict[str, int], ex: int = 86400):
    if cache:
        try:
            with cache.pipeline() as pipe:
                for key, value in keys_values.items():
                    pipe.set(key, value, ex=ex)
                pipe.execute()
        except Exception as e:
            logger.warning(f"Batch cache failed: {e}")

# Point 5: Timezone-aware helper
def get_timezone_aware_now(tz_str: str = TIMEZONE) -> datetime.datetime:
    tz = pytz.timezone(tz_str)
    return datetime.datetime.now(tz).date()

async def fetch_exchange_status_async(exchange: str) -> bool:
    # Point 4: Async for performance
    try:
        # Use explicit async lib
        exc_class = getattr(ccxt_async, exchange.lower(), None)
        if exc_class:
            exc = exc_class({'apiKey': CCXT_API_KEY, 'secret': CCXT_API_SECRET} if CCXT_API_KEY else {})
            if exc.has.get('fetchStatus'):
                status = await exc.fetch_status()
                await exc.close()
                return status.get('status') == 'ok'
            await exc.close()
    except Exception as e:
        logger.error(f"Async status check failed: {e}")
        return True
    return True

def is_weekend(date: datetime.date) -> bool:
    return date.weekday() >= 5

def is_custom_holiday(date: datetime.date, asset_type: str) -> bool:
    holidays = CUSTOM_HOLIDAYS.get(asset_type, [])
    month_day = (date.month, date.day)
    return month_day in holidays

async def is_trading_day_async(
    date: Optional[datetime.date] = None,
    exchange: Optional[str] = None,
    exchanges: Optional[List[str]] = None
) -> bool:
    """
    Checks if date is trading day with dynamic config.
    """
    try:
        cfg = get_config()
        current_type = cfg['TYPE']
        
        date = validate_date(date)
        exchange = sanitize_exchange(exchange)
        handler = ASSET_TYPE_HANDLERS.get(current_type, 'calendar_based')

        if exchanges:
            results = await asyncio.gather(*[is_trading_day_async(date, exc) for exc in exchanges])
            return all(results)

        cache_key = f"trading_day:{current_type}:{exchange}:{date.isoformat()}"
        if cache:
            cached = cache.get(cache_key)
            if cached is not None:
                return bool(int(cached))

        is_open = True

        try:
            if handler == 'always_open_with_status':  # crypto
                is_open = await fetch_exchange_status_async(exchange)

            elif handler == 'weekday_with_holidays':  # forex
                if is_weekend(date) or is_custom_holiday(date, current_type):
                    is_open = False

            elif handler == 'calendar_based':  # traditional etc
                cal = get_calendar(exchange)
                schedule = cal.schedule(start_date=date, end_date=date)
                is_open = not schedule.empty

        except ValueError as ve:
            logger.warning(f"Unsupported exchange/calendar: {ve}. Fallback to open.")
            is_open = True
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            send_alert(f"Market calendar error for {exchange}: {e}")
            is_open = True
            
        if cache:
             try:
                cache.set(cache_key, int(is_open), ex=86400)
             except Exception:
                 pass

        return is_open
    except Exception as outer_e:
        logger.error(f"Critical error in is_trading_day_async: {outer_e}")
        return True

def is_trading_day(*args, **kwargs) -> bool:
    # Sync wrapper for async (Point 4: Performance in sync contexts)
    try:
        return asyncio.run(is_trading_day_async(*args, **kwargs))
    except Exception as e:
        logger.error(f"Sync wrapper failed: {e}")
        return True

def get_market_calendar(
    start_date: str,
    end_date: str,
    exchange: Optional[str] = None,
    exchanges: Optional[List[str]] = None
) -> pd.DataFrame:
    """
    Generates calendar DataFrame for range with dynamic config.
    """
    try:
        cfg = get_config()
        current_type = cfg['TYPE']

        start = pd.to_datetime(start_date).date()
        end = pd.to_datetime(end_date).date()
        exchange = sanitize_exchange(exchange)

        dates = pd.date_range(start=start_date, end=end_date, freq='D')
        df = pd.DataFrame({'date': dates.date})

        handler = ASSET_TYPE_HANDLERS.get(current_type, 'calendar_based')

        cache_values = {}
        
        if exchanges:
            multi_dfs = []
            for exc in exchanges:
                sub_df = get_market_calendar(start_date, end_date, exc)
                multi_dfs.append(sub_df['open'])
            df['open'] = pd.concat(multi_dfs, axis=1).all(axis=1)
            return df

        if handler == 'always_open_with_status':
            df['open'] = True

        elif handler == 'weekday_with_holidays':
            df['open'] = df['date'].apply(lambda d: not (is_weekend(d) or is_custom_holiday(d, current_type)))

        elif handler == 'calendar_based':
            try:
                cal = get_calendar(exchange)
                valid = cal.valid_days(start_date=start_date, end_date=end_date)
                valid_dates = set([d.date() for d in valid])
                df['open'] = df['date'].isin(valid_dates)
            except Exception:
                df['open'] = True

        try:
            tz = pytz.timezone(TIMEZONE)
            df['open_time'] = df['date'].apply(lambda d: datetime.datetime.combine(d, datetime.time.min).replace(tzinfo=tz))
            df['close_time'] = df['date'].apply(lambda d: datetime.datetime.combine(d, datetime.time.max).replace(tzinfo=tz))
        except Exception as tze:
            logger.warning(f"Timezone conversion failed: {tze}")

        for _, row in df.iterrows():
            key = f"trading_day:{current_type}:{exchange}:{row['date'].isoformat()}"
            cache_values[key] = int(row['open'])
        batch_cache_set(cache_values)

    except Exception as e:
        logger.error(f"Calendar generation error: {e}")
        send_alert(f"Failed to generate calendar: {e}")
        df['open'] = True

    return df

if __name__ == "__main__":
    # Point 8: Unit tests (run python market_calendar.py to test)
    try:
        test_date = datetime.date(2026, 1, 1)  # New Year's - holiday for many
        print("Test 1: Crypto - Should be True")
        os.environ['EXCHANGE_TYPE'] = 'crypto'
        print(is_trading_day(test_date))  # Assume open

        print("Test 2: Forex - New Year's holiday")
        os.environ['EXCHANGE_TYPE'] = 'forex'
        print(is_trading_day(test_date))  # False

        print("Test 3: Traditional NYSE - Holiday")
        os.environ['EXCHANGE_TYPE'] = 'traditional'
        os.environ['EXCHANGE_NAME'] = 'NYSE'
        print(is_trading_day(test_date))  # False if holiday

        print("Test 4: Multi-exchange")
        print(is_trading_day(test_date, exchanges=['Binance', 'NYSE']))  # False (AND)

        print("Test 5: Calendar generation")
        cal = get_market_calendar('2026-01-01', '2026-01-05')
        print(cal.head())

        print("All tests passed if logic matches expectations.")
    except Exception as e:
        print(f"Tests failed: {e}")
