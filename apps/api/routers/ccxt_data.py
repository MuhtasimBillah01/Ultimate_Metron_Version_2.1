# apps/api/routers/ccxt_data.py
from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict
import ccxt
import ccxt.async_support as ccxt_async  # Use async support for async functions
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/ccxt", tags=["CCXT Dynamic"])

# আমাদের সাপোর্টেড এক্সচেঞ্জ লিস্ট (ডাইনামিক + মেইনটেইনেবল)
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

class ExchangeInfo(BaseModel):
    id: str
    name: str

class MarketInfo(BaseModel):
    symbol: str
    base: str
    quote: str
    active: bool

@router.get("/exchanges", response_model=List[ExchangeInfo])
async def get_supported_exchanges():
    return SUPPORTED_EXCHANGES

def get_exchange_instance(exchange_id: str):
    exch = next((e for e in SUPPORTED_EXCHANGES if e["id"] == exchange_id), None)
    if not exch:
        raise HTTPException(status_code=404, detail="Exchange not supported")
    
    ccxt_id = exch["ccxt_id"]
    if not hasattr(ccxt_async, ccxt_id):
         raise HTTPException(status_code=400, detail=f"CCXT does not support {ccxt_id}")
    
    exchange_class = getattr(ccxt_async, ccxt_id)
    exchange = exchange_class({
        'enableRateLimit': True,  # খুব জরুরি!
        'options': {'defaultType': 'spot'}  # Hyperliquid-এর জন্য adjust হতে পারে
    })
    return exchange

@router.get("/markets/{exchange_id}")
async def get_markets(exchange_id: str):
    exchange = get_exchange_instance(exchange_id)
    try:
        markets = await exchange.load_markets()
        filtered = [
            {
                "symbol": symbol,
                "base": info['base'],
                "quote": info['quote'],
                "active": info.get('active', True)
            }
            for symbol, info in markets.items()
            if info.get('spot', False) and info.get('active', True)
        ]
        # সর্ট করে টপ পেয়ার আগে (optional)
        filtered.sort(key=lambda x: x["symbol"])
        return {"markets": filtered[:500]}  # খুব বেশি হলে লিমিট (frontend-এ search যোগ করব)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await exchange.close() 

@router.get("/ohlcv/{exchange_id}/{symbol}")
async def get_ohlcv(
    exchange_id: str,
    symbol: str,
    timeframe: str = "1h",
    limit: int = Query(100, le=1000)
):
    exchange = get_exchange_instance(exchange_id)
    try:
        ohlcv = await exchange.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)
        data = [
            {
                "timestamp": datetime.fromtimestamp(c[0] / 1000).isoformat(),
                "open": c[1],
                "high": c[2],
                "low": c[3],
                "close": c[4],
                "volume": c[5]
            }
            for c in ohlcv
        ]
        return {"symbol": symbol, "timeframe": timeframe, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await exchange.close()
