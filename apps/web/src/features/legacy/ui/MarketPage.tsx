import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/shared/ui/Badge";
import { Loader2, Search, TrendingUp, TrendingDown, Activity } from "lucide-react";

const MarketPage = () => {
    const [ticker, setTicker] = useState("BTC-USD");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        setLoading(true);
        setError("");
        setData(null);

        try {
            // API Call to your new Backend Router
            // Using localhost:8000 as per user snippet. In prod, use relative or env var.
            const response = await fetch('http://localhost:8000/market/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker: ticker })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.detail || "Analysis failed");
            setData(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Market Intelligence</h1>
                <p className="text-muted-foreground">AI-Powered Technical Analysis Engine</p>
            </div>

            {/* Search Section */}
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardContent className="pt-6 flex gap-4">
                    <Input
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                        placeholder="Enter Ticker (e.g. BTC-USD, AAPL)"
                        className="text-lg font-mono uppercase"
                    />
                    <Button onClick={handleAnalyze} disabled={loading} size="lg" className="w-32">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        Analyze
                    </Button>
                </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                    ⚠️ {error}
                </div>
            )}

            {/* Results Display */}
            {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* Signal Card */}
                    <Card className={`border-l-4 ${data.signal === 'BUY' ? 'border-l-green-500' : data.signal === 'SELL' ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{data.symbol}</span>
                                <span className={`px-3 py-1 rounded text-sm font-bold ${data.signal === 'BUY' ? 'bg-green-500/20 text-green-500' :
                                        data.signal === 'SELL' ? 'bg-red-500/20 text-red-500' :
                                            'bg-yellow-500/20 text-yellow-500'
                                    }`}>
                                    {data.signal}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold font-mono">${data.price.toLocaleString()}</div>
                        </CardContent>
                    </Card>

                    {/* Indicators Grid */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center"><Activity className="mr-2 h-4 w-4" /> Technicals</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-muted-foreground">RSI (14)</span>
                                <span className={`font-mono font-bold ${data.indicators.rsi > 70 || data.indicators.rsi < 30 ? 'text-primary' : ''}`}>
                                    {data.indicators.rsi}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-muted-foreground">MACD</span>
                                <span className="font-mono font-bold">{data.indicators.macd}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-muted-foreground">Bollinger Upper</span>
                                <span className="font-mono font-bold">{data.indicators.upper_band}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default MarketPage;
