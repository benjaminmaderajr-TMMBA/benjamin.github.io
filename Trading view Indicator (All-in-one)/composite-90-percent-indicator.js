/**
 * 90% Accuracy Composite Indicator - JavaScript Version
 * 
 * Combines 6 indicators:
 * 1. ADX Tides Zones
 * 2. Bayesian Trend Indicator
 * 3. Heikin Ashi RSI Oscillator
 * 4. WaveTrend (Market Chypher Waves)
 * 5. Triple RSI
 * 6. UCS Murrey's Math Oscillator
 * 
 * Target: Identify 50-cent price moves with 90% accuracy
 */

class Composite90PercentIndicator {
    constructor(config = {}) {
        // Configuration
        this.priceTargetCents = config.priceTargetCents || 50.0;
        this.minTrendBars = config.minTrendBars || 3;
        this.minConvergence = config.minConvergence || 4;
        this.bullishThreshold = config.bullishThreshold || 9.0;
        this.bearishThreshold = config.bearishThreshold || 9.0;
        
        // Indicator weights
        this.weights = {
            adx: config.weights?.adx || 2.5,
            bayesian: config.weights?.bayesian || 2.5,
            harsi: config.weights?.harsi || 2.0,
            waveTrend: config.weights?.waveTrend || 2.5,
            tripleRSI: config.weights?.tripleRSI || 3.0,
            murrey: config.weights?.murrey || 2.0
        };
        
        // Price history
        this.priceHistory = [];
        this.volumeHistory = [];
        
        // Trend tracking
        this.entryPrice = null;
        this.trendBars = 0;
        this.trendDirection = 0;
    }
    
    // Helper: Add candle
    addCandle(open, high, low, close, volume, timestamp) {
        this.priceHistory.push({ open, high, low, close, volume, timestamp });
        this.volumeHistory.push(volume);
    }
    
    // Helper: SMA
    sma(values, period) {
        if (values.length < period) return null;
        const slice = values.slice(-period);
        return slice.reduce((a, b) => a + b, 0) / period;
    }
    
    // Helper: EMA
    ema(values, period) {
        if (values.length < period) return null;
        let multiplier = 2 / (period + 1);
        let ema = this.sma(values.slice(0, period), period);
        for (let i = period; i < values.length; i++) {
            ema = (values[i] - ema) * multiplier + ema;
        }
        return ema;
    }
    
    // Helper: RSI
    rsi(values, period = 14) {
        if (values.length < period + 1) return null;
        let gains = 0, losses = 0;
        for (let i = values.length - period; i < values.length; i++) {
            const change = values[i] - values[i - 1];
            if (change > 0) gains += change;
            else losses += Math.abs(change);
        }
        const avgGain = gains / period;
        const avgLoss = losses / period;
        if (avgLoss === 0) return 100;
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }
    
    // Helper: ATR
    atr(period = 14) {
        if (this.priceHistory.length < period + 1) return null;
        const trs = [];
        for (let i = this.priceHistory.length - period; i < this.priceHistory.length; i++) {
            const prev = this.priceHistory[i - 1];
            const curr = this.priceHistory[i];
            const tr = Math.max(
                curr.high - curr.low,
                Math.abs(curr.high - prev.close),
                Math.abs(curr.low - prev.close)
            );
            trs.push(tr);
        }
        return this.sma(trs, period);
    }
    
    // Calculate all 6 indicators
    calculateIndicators() {
        if (this.priceHistory.length < 100) return null;
        
        const closes = this.priceHistory.map(c => c.close);
        const highs = this.priceHistory.map(c => c.high);
        const lows = this.priceHistory.map(c => c.low);
        const src = this.priceHistory.map(c => (c.high + c.low + c.close) / 3);
        const currentPrice = closes[closes.length - 1];
        
        // 1. ADX Tides
        const adxResult = this.calculateADXTides(closes, highs, lows, src);
        
        // 2. Bayesian Trend
        const bayesianResult = this.calculateBayesian(src, closes);
        
        // 3. Heikin Ashi RSI
        const harsiResult = this.calculateHARSI(closes, src);
        
        // 4. WaveTrend
        const waveTrendResult = this.calculateWaveTrend(src);
        
        // 5. Triple RSI
        const tripleRSIResult = this.calculateTripleRSI(closes);
        
        // 6. Murrey Math
        const murreyResult = this.calculateMurreyMath(closes, highs, lows);
        
        return {
            adx: adxResult,
            bayesian: bayesianResult,
            harsi: harsiResult,
            waveTrend: waveTrendResult,
            tripleRSI: tripleRSIResult,
            murrey: murreyResult
        };
    }
    
    // 1. ADX Tides
    calculateADXTides(closes, highs, lows, src) {
        const adxLen = 21;
        const emaLen = 15;
        const adxThreshold = 25;
        
        // Simplified ADX
        let diPlus = 0, diMinus = 0;
        for (let i = closes.length - adxLen; i < closes.length; i++) {
            if (i > 0) {
                const highDiff = highs[i] - highs[i - 1];
                const lowDiff = lows[i - 1] - lows[i];
                if (highDiff > lowDiff && highDiff > 0) diPlus += highDiff;
                if (lowDiff > highDiff && lowDiff > 0) diMinus += lowDiff;
            }
        }
        
        const adxValue = (diPlus + diMinus) > 0 ? Math.abs(diPlus - diMinus) / (diPlus + diMinus) * 100 : 0;
        const adxStrong = adxValue >= adxThreshold;
        const trendDirection = diPlus > diMinus ? 1 : diMinus > diPlus ? -1 : 0;
        
        const ema1 = this.ema(closes, emaLen);
        const centerLine = ema1;
        const priceAboveCenter = currentPrice > centerLine;
        
        return {
            adxValue,
            adxStrong,
            trendDirection,
            bullish: adxStrong && trendDirection === 1 && priceAboveCenter,
            bearish: adxStrong && trendDirection === -1 && !priceAboveCenter
        };
    }
    
    // 2. Bayesian Trend
    calculateBayesian(src, closes) {
        const length = 60;
        const gapLength = 20;
        const gap = 10;
        
        const emaSlow = this.ema(closes, length);
        const smaSlow = this.sma(closes, length);
        const emaFast = this.ema(closes, length - gapLength);
        const smaFast = this.sma(closes, length - gapLength);
        
        if (!emaSlow || !smaSlow || !emaFast || !smaFast) return null;
        
        const currentPrice = closes[closes.length - 1];
        const sigSlow = currentPrice >= emaSlow ? 1 : 0;
        const sigFast = currentPrice >= emaFast ? 1 : 0;
        
        const priorUp = (sigSlow + (currentPrice >= smaSlow ? 1 : 0)) / 2;
        const likelihoodUp = (sigFast + (currentPrice >= smaFast ? 1 : 0)) / 2;
        
        const posteriorUp = (priorUp * likelihoodUp) / 
                           (priorUp * likelihoodUp + (1 - priorUp) * (1 - likelihoodUp));
        
        return {
            posteriorUp,
            bullish: posteriorUp > 0.52,
            bearish: posteriorUp < 0.48
        };
    }
    
    // 3. Heikin Ashi RSI
    calculateHARSI(closes, src) {
        const harsiLen = 14;
        const rsiPlotLen = 7;
        
        const rsiBase = this.rsi(closes, harsiLen);
        const rsiPlot = this.rsi(closes, rsiPlotLen);
        
        if (!rsiBase || !rsiPlot) return null;
        
        const zrsi = rsiBase - 50;
        const haClose = zrsi;
        const haOpen = this.priceHistory.length > 1 ? 
                      (this.rsi(closes.slice(0, -1), harsiLen) - 50) : haClose;
        const haBody = haClose - haOpen;
        
        return {
            rsi: rsiBase,
            rsiPlot,
            haBody,
            bullish: haBody > 0 && rsiBase > 50,
            bearish: haBody < 0 && rsiBase < 50,
            overbought: rsiBase > 80,
            oversold: rsiBase < 20
        };
    }
    
    // 4. WaveTrend
    calculateWaveTrend(src) {
        const n1 = 10;
        const n2 = 21;
        
        const esa = this.ema(src, n1);
        if (!esa) return null;
        
        const diffs = src.slice(-n1).map((val, i) => {
            const idx = src.length - n1 + i;
            return Math.abs(val - esa);
        });
        const d = this.ema(diffs, n1);
        if (!d || d === 0) return null;
        
        const currentHlc3 = src[src.length - 1];
        const ci = (currentHlc3 - esa) / (0.015 * d);
        const tci = this.ema([ci], n2);
        
        const wt1 = tci;
        const wt2 = this.sma([wt1], 3);
        
        const obLevel2 = 53;
        const osLevel2 = -53;
        
        return {
            wt1,
            wt2,
            bullish: wt1 > wt2 && wt1 > osLevel2,
            bearish: wt1 < wt2 && wt1 < obLevel2,
            overbought: wt1 > obLevel2,
            oversold: wt1 < osLevel2
        };
    }
    
    // 5. Triple RSI
    calculateTripleRSI(closes) {
        const rsi1 = this.rsi(closes, 7);
        const rsi2 = this.rsi(closes, 14);
        const rsi3 = this.rsi(closes, 21);
        
        if (!rsi1 || !rsi2 || !rsi3) return null;
        
        const allBullish = rsi1 > 50 && rsi2 > 50 && rsi3 > 50;
        const allBearish = rsi1 < 50 && rsi2 < 50 && rsi3 < 50;
        const rsiAvg = (rsi1 + rsi2 + rsi3) / 3;
        
        return {
            rsi1,
            rsi2,
            rsi3,
            rsiAvg,
            bullish: allBullish && rsiAvg > 60,
            bearish: allBearish && rsiAvg < 40
        };
    }
    
    // 6. Murrey Math
    calculateMurreyMath(closes, highs, lows) {
        const length = 100;
        const mult = 0.125;
        
        const recentHighs = highs.slice(-length);
        const recentLows = lows.slice(-length);
        const hi = Math.max(...recentHighs);
        const lo = Math.min(...recentLows);
        const range = hi - lo;
        
        if (range === 0) return null;
        
        const multiplier = range * mult;
        const midline = lo + multiplier * 4;
        const currentClose = closes[closes.length - 1];
        const oscillator = (currentClose - midline) / (range / 2);
        
        return {
            oscillator,
            bullish: oscillator > multiplier * 4,
            bearish: oscillator < -multiplier * 4,
            neutral: Math.abs(oscillator) < multiplier * 2
        };
    }
    
    // Calculate composite score and signal
    calculate() {
        const indicators = this.calculateIndicators();
        if (!indicators) return null;
        
        // Calculate scores
        let bullishScore = 0;
        let bullishCount = 0;
        let bearishScore = 0;
        let bearishCount = 0;
        
        if (indicators.adx?.bullish) {
            bullishScore += this.weights.adx;
            bullishCount++;
        }
        if (indicators.adx?.bearish) {
            bearishScore += this.weights.adx;
            bearishCount++;
        }
        
        if (indicators.bayesian?.bullish) {
            bullishScore += this.weights.bayesian;
            bullishCount++;
        }
        if (indicators.bayesian?.bearish) {
            bearishScore += this.weights.bayesian;
            bearishCount++;
        }
        
        if (indicators.harsi?.bullish) {
            bullishScore += this.weights.harsi;
            bullishCount++;
        }
        if (indicators.harsi?.bearish) {
            bearishScore += this.weights.harsi;
            bearishCount++;
        }
        
        if (indicators.waveTrend?.bullish) {
            bullishScore += this.weights.waveTrend;
            bullishCount++;
        }
        if (indicators.waveTrend?.bearish) {
            bearishScore += this.weights.waveTrend;
            bearishCount++;
        }
        
        if (indicators.tripleRSI?.bullish) {
            bullishScore += this.weights.tripleRSI;
            bullishCount++;
        }
        if (indicators.tripleRSI?.bearish) {
            bearishScore += this.weights.tripleRSI;
            bearishCount++;
        }
        
        if (indicators.murrey?.bullish) {
            bullishScore += this.weights.murrey;
            bullishCount++;
        }
        if (indicators.murrey?.bearish) {
            bearishScore += this.weights.murrey;
            bearishCount++;
        }
        
        // Update trend tracking
        const currentPrice = this.priceHistory[this.priceHistory.length - 1].close;
        
        if (bullishScore >= this.bullishThreshold && bullishCount >= this.minConvergence && !this.entryPrice) {
            this.entryPrice = currentPrice;
            this.trendBars = 0;
            this.trendDirection = 1;
        } else if (bearishScore >= this.bearishThreshold && bearishCount >= this.minConvergence && !this.entryPrice) {
            this.entryPrice = currentPrice;
            this.trendBars = 0;
            this.trendDirection = -1;
        } else if (this.entryPrice) {
            const priceChange = Math.abs(currentPrice - this.entryPrice) * 100; // in cents
            const targetReached = priceChange >= this.priceTargetCents;
            
            if ((this.trendDirection === 1 && currentPrice > this.entryPrice) || 
                (this.trendDirection === -1 && currentPrice < this.entryPrice)) {
                this.trendBars++;
            } else {
                this.trendBars = Math.max(0, this.trendBars - 1);
            }
            
            if (targetReached || this.trendBars < 0) {
                this.entryPrice = null;
                this.trendBars = 0;
                this.trendDirection = 0;
            }
        }
        
        // Generate signals
        const bullishSignal = bullishScore >= this.bullishThreshold && 
                             bullishCount >= this.minConvergence && 
                             this.trendBars >= this.minTrendBars &&
                             this.trendDirection === 1;
        
        const bearishSignal = bearishScore >= this.bearishThreshold && 
                             bearishCount >= this.minConvergence && 
                             this.trendBars >= this.minTrendBars &&
                             this.trendDirection === -1;
        
        return {
            indicators,
            bullishScore,
            bearishScore,
            bullishCount,
            bearishCount,
            bullishSignal,
            bearishSignal,
            trendBars: this.trendBars,
            entryPrice: this.entryPrice,
            trendDirection: this.trendDirection
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Composite90PercentIndicator;
}

