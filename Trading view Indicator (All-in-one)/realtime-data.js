// Real-time market data fetcher using Alpaca MCP tools
// This will be called from the frontend to get live data

class RealTimeDataFetcher {
    constructor(symbol = 'SPY') {
        this.symbol = symbol;
        this.updateInterval = 2000; // Update every 2 seconds
        this.intervalId = null;
        this.callbacks = [];
    }
    
    start(callback) {
        this.callbacks.push(callback);
        if (!this.intervalId) {
            this.fetchData();
            this.intervalId = setInterval(() => this.fetchData(), this.updateInterval);
        }
    }
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    async fetchData() {
        try {
            // Fetch from backend API endpoint
            const response = await fetch(`/api/market-data/${this.symbol}`);
            const data = await response.json();
            
            // Notify all callbacks
            this.callbacks.forEach(cb => cb(data));
        } catch (error) {
            console.error('Error fetching real-time data:', error);
            this.callbacks.forEach(cb => cb({ error: error.message }));
        }
    }
    
    setSymbol(symbol) {
        this.symbol = symbol.toUpperCase();
    }
}

// Export for use in HTML
window.RealTimeDataFetcher = RealTimeDataFetcher;


