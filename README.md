# momentum-heatmap-rsi-cross
This is an experimental momentum tool designed to combine the best of Vortex, MACD, and RSI into a single mathematical formula.

📘 User Manual: Momentum + Heatmap with RSI Cross (Nikko)
Version: 1.0
Author: Cryptonikkoid
Platform: TradingView – Pine Script v6
License: Mozilla Public License 2.0
Release Date: June 2025

🔍 Overview
The Momentum + Heatmap with RSI Cross is an advanced visual indicator designed to replace traditional oscillators by merging multiple indicators into one. It blends Vortex, Stochastic, RSI, and MACD into a unified, mathematically enhanced momentum signal. This tool highlights trend shifts, potential reversals, and momentum build-up with intuitive visuals and alert signals.

The indicator includes:

A hybrid oscillator reflecting directional strength and momentum.

A heatmap background representing RSI × Vortex energy.

Buy/Sell triangle alerts based on RSI-style crossovers.

A clean layout optimized for decision-making speed.

⚙️ How It Works
Vortex Strength

The indicator computes Vortex Positive (VI+) and Vortex Negative (VI–) over a user-defined period.

The difference between the two creates a directional bias signal (viDiff).

Stochastic Momentum

The viDiff value is normalized through a stochastic oscillator, producing smoothed %K and %D curves.

These curves serve as the base for momentum signals.

RSI and Long-Term RSI

The RSI is computed and normalized to a 0–1 scale.

A long-term RSI (5× period) is also calculated to act as a trend anchor.

MACD Filtering

A MACD calculation determines whether the market is in a bullish or bearish condition.

The hybrid signals are flipped accordingly to follow the broader trend.

Hybrid Oscillator Construction

%K and %D are multiplied by exponential factors of RSI and long RSI.

This adds acceleration to the signals when momentum is increasing rapidly.

RSI Cross Detection

When the hybrid %K crosses above hybrid %D, a Sell triangle appears (potential peak).

When it crosses below, a Buy triangle appears (momentum reversal).

Heatmap Background

A visual background shows the interaction between Vortex and RSI energy.

Colors shift from deep purple (low momentum) to blue (strong bullish energy).

The heatmap can be toggled on/off for clarity.

Alerts

Built-in alert conditions allow you to be notified instantly on buy/sell signals.

🧠 How to Use
Apply the Indicator

Add it to any chart on TradingView.

It works best on trending assets and volatile conditions like crypto or indices.

Read the Hybrid Oscillator

Use the hybrid %K and %D like a momentum wave.

Strong upward waves + a green heatmap = potential long.

Sharp downward spikes + fading heatmap = caution or potential exit.

Watch the Triangles

A green triangle below a bar suggests a buy signal — momentum is reversing upward.

A red triangle above a bar signals momentum exhaustion — potential sell or take profit.

Heatmap Guidance

When the background is faint or fades to purple, it indicates weak conditions.

Blueish tones signal growing bullish strength.

Use with Price Action

Combine triangle alerts with support/resistance, price structure, or volume.

This indicator is not a standalone entry tool, but a strong directional filter.

✅ Benefits
Single Indicator Solution: Replaces multiple tools like MACD, RSI, and Stochastic.

Momentum + Trend Fusion: Combines short-term reversals with long-term trend confirmation.

Visual Simplicity: Clear oscillator waves, triangle icons, and color-coded heatmaps reduce decision fatigue.

Built-in Alerts: Get notified the moment momentum shifts.

Customizable: You can tweak lengths and smoothing for your asset and timeframe.

⚠️ Limitations
Slight Lag: Smoothing adds stability but can delay signals by a few candles.

Whipsaw in Sideways Markets: Like all momentum tools, performance is better in trending conditions.

Requires Confirmation: Best used with other tools like structure or volume to confirm trades.

Experimental Math: This is an experimental formulation; more feedback could help fine-tune signal logic.

🔁 What's New Compared to Traditional Indicators
Unlike using RSI, MACD, or Stochastic separately, this indicator:

Integrates all three into a unified momentum model.

Adds long-term RSI filtering to reduce noise.

Uses exponential scaling to enhance signal acceleration.

Features heatmap visualization to intuitively show energy buildup.

Provides actionable visual alerts without relying solely on numeric values.

🛠️ Tips and Customization
Adjust the rsiLength, viLength, and MACD settings for different markets (e.g. faster for scalping, slower for swing).

Toggle off the heatmap if you prefer a cleaner look using the checkbox.

Use higher timeframes (4h, 1D) for swing trading or lower timeframes (15m–1h) for intraday.

Combine with volume spikes or trendlines to enhance trade confirmation.

Add alertcondition() messages to trigger webhook or mobile alerts.

🎯 Final Thoughts
Momentum + Heatmap with RSI Cross simplifies the complexity of momentum analysis into a smooth, visually intuitive signal. It helps identify entry zones early, avoid chasing reversals blindly, and gives clear exit alerts based on dynamic crossovers.

If you want cleaner charts with smarter momentum tracking — this tool is built for that.
