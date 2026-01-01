import ccxt
exchange = ccxt.binance()
ticker = exchange.fetch_ticker('BTC/USDT')
print(f"BTC/USDT Price: {ticker['last']}")
