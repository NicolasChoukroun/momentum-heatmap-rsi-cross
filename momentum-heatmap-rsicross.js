//@version=6
//This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// by Cryptonikkoid June 2025
// version 1.0
// https://t.me/cryptonikkoid

indicator("Momentum + Heatmap + Cross Alerts (Nikko)", overlay=false)

// === INPUT PARAMETERS ===
hideheatmap  = input.bool(false, title="Hide Heatmap")
viLength     = input.int(14, title="Vortex Length")
stochLength  = input.int(14, title="Stochastic Length")
smoothK      = input.int(3, title="Smoothing %K")
smoothD      = input.int(3, title="Smoothing %D")
rsiLength    = input.int(12, title="RSI Length")
macdFast     = input.int(4, title="MACD Fast Length")
macdSlow     = input.int(28, title="MACD Slow Length")
macdSignal   = input.int(12, title="MACD Signal Smoothing")
rsishortSmoothing   = input.int(50, title="RSI long Smoothing")
rsilongSmoothing   = input.int(500, title="RSI short Smoothing")

// === TRUE RANGE FOR VORTEX ===
tr = math.max(math.max(high - low, math.abs(high - close[1])), math.abs(low - close[1]))
vmPlus  = math.abs(high - low[1])
vmMinus = math.abs(low - high[1])
sumVMPlus  = math.sum(vmPlus, viLength)
sumVMMinus = math.sum(vmMinus, viLength)
sumTR      = math.sum(tr, viLength)

vip = sumVMPlus / sumTR
vin = sumVMMinus / sumTR
viDiff = vip - vin

// === STOCHASTIC OF VI DIFFERENCE ===
lowestVal = ta.lowest(viDiff, stochLength)
highestVal = ta.highest(viDiff, stochLength)
stochRaw = (viDiff - lowestVal) / (highestVal - lowestVal)
k = ta.sma(stochRaw, smoothK)
d = ta.sma(k, smoothD)

// === RSI (normalized 0–1) ===
rsi = ta.rsi(close, rsiLength) / rsishortSmoothing
rsilong = ta.rsi(close, rsiLength*5)/rsilongSmoothing

// === MACD ===
[macdLine, macdSigLine, _] = ta.macd(close, macdFast, macdSlow, macdSignal)
macdTrend = macdLine - macdSigLine

// === FINAL HYBRID SIGNAL
kHybrid = k * math.exp(rsilong) * (macdTrend >= 0 ? 1 : -1)
dHybrid = d * math.exp(rsi) * (macdTrend >= 0 ? 1 : -1)

// === HEATMAP BASED ON RSI × VORTEX ===
rsiVortexRaw = (viDiff * rsi)
rsiVortexNorm = math.min(math.max((rsiVortexRaw + 1) / 2, 0), 1)  // normalize between 0 and 1

// Heatmap colors based on the normalized value
heatColor = color.from_gradient(rsiVortexNorm, 0, 1, color.rgb(255, 0, kHybrid*dHybrid, 50), color.rgb(0, 255, kHybrid*dHybrid, 50))
bgcolor(hideheatmap?na:heatColor)

// === HYBRID CROSSOVER DETECTION ===
rsiCrossUp = ta.crossover(kHybrid, dHybrid)  // RSI crosses above RSILong
rsiCrossDown = ta.crossunder(kHybrid, dHybrid)  // RSILong crosses above RSI

// === PLOTS ===
plot(kHybrid, title="Hybrid %K × RSI × MACD", color=color.new(#04ff15, 0))
plot(dHybrid, title="Hybrid %D × RSI × MACD", color=color.new(color.orange, 0))
hline(0.8, "Strong Up", color=color.green)
hline(-0.8, "Strong Down", color=color.red)
hline(0.0, "Neutral", color=color.gray)

// === ALERT CONDITIONS ===
alertcondition(rsiCrossDown, title="Buy Signal", message="🔔 Buy Signal: Momentum shift detected.")
alertcondition(rsiCrossUp, title="Sell Signal", message="🔔 Sell Signal: Momentum peak detected.")

// === PLOT CROSS ICON BASED ON RSI CROSSING RSILong ===
plotshape(rsiCrossDown?open:na, title="RSI Cross Up", text="Buy", textcolor=color.green, force_overlay=true,location=location.belowbar, color=color.green, style=shape.triangleup, size=size.small)
plotshape(rsiCrossUp?close:na, title="RSILong Cross Down",text="Sell", textcolor=color.red,force_overlay=true,location=location.abovebar, color=color.red, style=shape.triangledown, size=size.small)
