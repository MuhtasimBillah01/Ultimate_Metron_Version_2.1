from fastapi import APIRouter, HTTPException, Query
import pandas as pd
from apps.api.utils.technical_features import MarketFeatureProcessor
import ccxt.async_support as ccxt_async
from datetime import datetime

router = APIRouter(prefix="/analysis", tags=["Market Analysis"])

# Reusing the supported exchanges logic or importing it would be better, but for now defining helper
SUPPORTED_EXCHANGES = [
    {"id": "binance", "name": "Binance", "ccxt_id": "binance"},
    {"id": "bybit", "name": "Bybit", "ccxt_id": "bybit"},
    {"id": "hyperliquid", "name": "Hyperliquid", "ccxt_id": "hyperliquid"},
    {"id": "okx", "name": "OKX", "ccxt_id": "okx"},
    {"id": "kucoin", "name": "KuCoin", "ccxt_id": "kucoin"},
    {"id": "gate", "name": "Gate.io", "ccxt_id": "gate"},
    {"id": "mexc", "name": "MEXC", "ccxt_id": "mexc"},
    {"id": "bitget", "name": "Bitget", "ccxt_id": "bitget"},
]

def get_exchange_instance(exchange_id: str):
    exch = next((e for e in SUPPORTED_EXCHANGES if e["id"] == exchange_id), None)
    if not exch:
        raise HTTPException(status_code=404, detail="Exchange not supported")
    
    ccxt_id = exch["ccxt_id"]
    if not hasattr(ccxt_async, ccxt_id):
         raise HTTPException(status_code=400, detail=f"CCXT does not support {ccxt_id}")
    
    exchange_class = getattr(ccxt_async, ccxt_id)
    exchange = exchange_class({
        'enableRateLimit': True,
        'options': {'defaultType': 'spot'}
    })
    return exchange

@router.get("/market-data/{exchange}/{symbol}")
async def get_market_analysis(
    exchange: str, 
    symbol: str, 
    timeframe: str = "1h",
    limit: int = 500
):
    exchange_instance = None
    try:
        # 1. Fetch Raw Data
        formatted_symbol = symbol.replace("_", "/")
        
        exchange_instance = get_exchange_instance(exchange)
        
        # Fetching slightly more data for indicators to warm up (e.g. EMA 200)
        fetch_limit = limit + 200
        ohlcv = await exchange_instance.fetch_ohlcv(formatted_symbol, timeframe=timeframe, limit=fetch_limit)
        
        if not ohlcv:
             raise HTTPException(status_code=404, detail="Data not found")

        # Convert to DataFrame
        # CCXT OHLCV structure: [timestamp, open, high, low, close, volume]
        df_raw = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        df_raw['datetime'] = pd.to_datetime(df_raw['timestamp'], unit='ms')
        df_raw.set_index('datetime', inplace=True)

        # 2. Feature Engineering
        processor = MarketFeatureProcessor()
        
        # Handling missing columns that might be expected by the processor
        if 'funding_rate' not in df_raw.columns:
             df_raw['funding_rate'] = 0.0
        if 'open_interest' not in df_raw.columns:
             df_raw['open_interest'] = 0.0

        df_processed = processor.add_technical_features(df_raw)

        # 3. Prepare JSON response
        # Returning only the requested limit amount of latest data
        result_df = df_processed.tail(limit).reset_index()
        # Convert timestamp back to something JSON serializable if needed or keep string
        # The frontend/recharts usually likes ISO strings or timestamps.
        # Let's ensure it's friendly.
        
        # We need to make sure we don't return NaN values in JSON as they break things often,
        # but the processor already does dropna().
        
        result = result_df.to_dict(orient="records")
        
        # Clean up timestamps for frontend if needed (simpler to just send isoformat)
        for row in result:
            if isinstance(row['datetime'], pd.Timestamp):
                row['timestamp'] = row['datetime'].isoformat() # This overrides the msec timestamp with ISO string
                del row['datetime']

        return {
            "exchange": exchange,
            "symbol": formatted_symbol,
            "data": result
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if exchange_instance:
            await exchange_instance.close()
