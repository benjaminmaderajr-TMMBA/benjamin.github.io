# Indicators Directory

## 📁 Purpose

Drop your indicator files here for analysis and composite indicator creation.

## 📝 Supported Formats

### 1. **Pine Script Files** (`.pine`)
- TradingView Pine Script indicators
- I'll extract bullish/bearish criteria from the code

### 2. **JavaScript Files** (`.js`)
- JavaScript indicator implementations
- Should include signal detection logic

### 3. **Text/Description Files** (`.txt`, `.md`)
- Plain text descriptions of indicators
- Include:
  - Indicator name
  - Bullish criteria/signals
  - Bearish criteria/signals
  - Thresholds/parameters

## 📋 File Naming

Name your files descriptively:
- `rsi-indicator.pine`
- `macd-strategy.js`
- `bollinger-bands.txt`
- `custom-indicator-1.md`

## 🎯 What I'll Extract

For each indicator, I'll identify:
1. **Bullish Signals**: What conditions trigger buy/long signals
2. **Bearish Signals**: What conditions trigger sell/short signals
3. **Thresholds**: Key values (RSI < 30, MACD crossover, etc.)
4. **Weight/Reliability**: How important each signal is

## 🔄 Process

1. **Drop your 6 indicator files** in this directory
2. **I'll analyze each one** and extract criteria
3. **Create a composite indicator** combining all 6
4. **Generate code** (Pine Script + JavaScript) with weighted scoring

## 📊 Example Format

If you're creating a text file, use this format:

```
INDICATOR: RSI
BULLISH: RSI < 30, RSI rising from oversold
BEARISH: RSI > 70, RSI falling from overbought
THRESHOLDS: Oversold < 30, Overbought > 70
WEIGHT: High (3.0)
```

## ✅ Ready to Use

Just drop your indicator files here and let me know when they're ready!


