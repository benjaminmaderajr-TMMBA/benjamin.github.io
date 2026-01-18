/**
 * Indicator Analysis Test Script
 * 
 * Run this in the browser console on http://localhost:3000/tradingview-chart.html
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Copy and paste these functions
 * 3. Run: testIndicatorAnalysis() or simulateIndicatorTest()
 */

// Test current indicator calculations
function testIndicatorAnalysis() {
    console.log('🧪 Testing Indicator Analysis...');
    console.log('Price History Length:', window.priceHistory?.length || 0);
    console.log('Indicator History Length:', window.indicatorHistory?.length || 0);
    
    if (window.calculateIndicators) {
        const indicators = window.calculateIndicators();
        if (indicators) {
            console.log('📊 Current Indicators:', indicators);
            
            if (window.analyzeIndicatorsForPrediction) {
                const analysis = window.analyzeIndicatorsForPrediction(indicators);
                if (analysis) {
                    console.log('🎯 Prediction:', analysis.prediction);
                    console.log('📈 Signals:', analysis.signals);
                    console.log('✅ Indicator analysis is working!');
                    return analysis;
                }
            }
        } else {
            console.log('⏳ Need more data points. Current:', window.priceHistory?.length || 0, '/ 14 required');
        }
    } else {
        console.log('❌ Indicator functions not available. Make sure page is loaded.');
    }
}

// Simulate price data to test indicators
function simulateIndicatorTest() {
    console.log('🧪 Simulating price data for indicator testing...');
    const basePrice = 100;
    const mockDataArray = [];
    
    for (let i = 0; i < 20; i++) {
        const priceChange = (Math.random() * 2 - 1) * 0.5;
        const mockData = {
            price: basePrice + (i * 0.1) + priceChange,
            volume: 1000000 + Math.random() * 500000,
            change: priceChange,
            changePercent: (priceChange / basePrice) * 100,
            high: basePrice + (i * 0.1) + Math.random() * 0.5,
            low: basePrice + (i * 0.1) - Math.random() * 0.5,
            open: basePrice + (i * 0.1),
            averageVolume: 1000000
        };
        mockDataArray.push(mockData);
        
        if (window.detectPatterns) {
            window.detectPatterns(mockData);
        }
        if (window.updateRealtimeAnalysis) {
            window.updateRealtimeAnalysis(mockData);
        }
    }
    
    console.log('✅ Simulated 20 data points.');
    console.log('📊 Mock Data:', mockDataArray);
    
    if (window.updateIndicatorDisplay) {
        window.updateIndicatorDisplay();
    }
    
    console.log('🎯 Check the indicators panel and replay feed for results!');
    return mockDataArray;
}

// Monitor indicator updates in real-time
function monitorIndicators(interval = 5000) {
    console.log(`👀 Monitoring indicators every ${interval/1000} seconds...`);
    const monitor = setInterval(() => {
        const indicators = window.calculateIndicators?.();
        if (indicators) {
            console.log('📊 Indicators Update:', {
                RSI: indicators.rsi?.toFixed(2),
                MACD: indicators.macd?.histogram.toFixed(3),
                SMA20: indicators.sma20?.toFixed(2),
                Prediction: window.analyzeIndicatorsForPrediction?.(indicators)?.prediction
            });
        }
    }, interval);
    
    console.log('⏹️  Run stopMonitoring() to stop');
    window.stopMonitoring = () => {
        clearInterval(monitor);
        console.log('✅ Monitoring stopped');
    };
    
    return monitor;
}

// Export functions to window for easy access
if (typeof window !== 'undefined') {
    window.testIndicatorAnalysis = testIndicatorAnalysis;
    window.simulateIndicatorTest = simulateIndicatorTest;
    window.monitorIndicators = monitorIndicators;
    
    console.log('✅ Indicator test functions loaded!');
    console.log('📝 Available functions:');
    console.log('  - testIndicatorAnalysis() - Test current indicators');
    console.log('  - simulateIndicatorTest() - Simulate 20 data points');
    console.log('  - monitorIndicators(5000) - Monitor indicators every 5 seconds');
}

