import ExchangeAnalysisPage from '@/features/exchange-analysis/ui/ExchangeAnalysisPage';

export default function MarketPage() {
    return (
        <div className="min-h-screen bg-transparent">
            <ExchangeAnalysisPage />
            <div className="text-center mt-2 text-xs text-muted-foreground pb-4">
                Phase 2 • MVP: Data provided by CCXT & yfinance.
            </div>
        </div>
    );
}
