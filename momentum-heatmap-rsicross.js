//@version=6
indicator("Momentum with Buy/Sell signals (Nikko) v1.1", overlay=false)  // Set overlay=true for labels to be on the chart

// === INPUT PARAMETERS ===
percentDifference = input.float(3, title="Percent Take Profit minimum",group="Internal")
viLength         = input.int(14, title="Vortex Length",group="Internal")
stochLength      = input.int(14, title="Stochastic Length",group="Internal")
smoothK          = input.int(3, title="Smoothing %K",group="Internal")
smoothD          = input.int(3, title="Smoothing %D",group="Internal")
rsiLength        = input.int(12, title="RSI Length",group="Internal")
macdFast         = input.int(4, title="MACD Fast Length",group="Internal")
macdSlow         = input.int(28, title="MACD Slow Length",group="Internal")
macdSignal       = input.int(12, title="MACD Signal Smoothing",group="Internal")
rsiShortSmooth   = input.int(100, title="RSI Short Smoothing (for normalization)",group="Internal")
rsiLongSmooth    = input.int(500, title="RSI Long Smoothing (for normalization)",group="Internal")

// === COLOR CUSTOMIZATION (🎨 Color Settings tab) ===
hideHeatmap      = input.bool(false, title="Hide Heatmap",group="🎨 Color Settings")
hideLabels      = input.bool(false, title="Hide Labels",group="🎨 Custom Settings")
colorLow     = input.color(color.rgb(255, 0, 0, 60), title="Heatmap Low Color", group="🎨 Color Settings")
colorHigh    = input.color(color.rgb(0, 255, 0, 60), title="Heatmap High Color", group="🎨 Color Settings")
kColor       = input.color(color.rgb(4, 255, 21, 0), title="Hybrid %K Line Color", group="🎨 Color Settings")
dColor       = input.color(color.rgb(255, 165, 0, 0), title="Hybrid %D Line Color", group="🎨 Color Settings")
buyColor     = input.color(color.rgb(0, 180, 0, 0), title="Buy Signal Icon Color", group="🎨 Color Settings")
sellColor    = input.color(color.rgb(180, 0, 0, 0), title="Sell Signal Icon Color", group="🎨 Color Settings")

// === VORTEX INDICATOR ===
tr       = math.max(math.max(high - low, math.abs(high - close[1])), math.abs(low - close[1]))
vmPlus   = math.abs(high - low[1])
vmMinus  = math.abs(low - high[1])
sumTR    = math.sum(tr, viLength)
vip      = math.sum(vmPlus, viLength) / sumTR
vin      = math.sum(vmMinus, viLength) / sumTR
viDiff   = vip - vin

// === STOCHASTIC OF VORTEX DIFFERENCE ===
lowestVal  = ta.lowest(viDiff, stochLength)
highestVal = ta.highest(viDiff, stochLength)
stochRaw   = (viDiff - lowestVal) / (highestVal - lowestVal)
k          = ta.sma(stochRaw, smoothK)
d          = ta.sma(k, smoothD)

// === RSI NORMALIZED ===
rsi      = ta.rsi(close, rsiLength) / rsiShortSmooth
rsiLong  = ta.rsi(close, rsiLength * 5) / rsiLongSmooth

// === MACD TREND ===
[macdLine, macdSigLine, _] = ta.macd(close, macdFast, macdSlow, macdSignal)
macdTrend = macdLine - macdSigLine

// === HYBRID SIGNAL ===
kHybrid = k * math.exp(rsiLong) * (macdTrend >= 0 ? 1 : -1)
dHybrid = d * math.exp(rsi) * (macdTrend >= 0 ? 1 : -1)

// === HEATMAP BASED ON RSI × VORTEX ===
rsiVortexRaw = viDiff * rsi
rsiVortexNorm = math.min(math.max((rsiVortexRaw + 1) / 2, 0), 1)
heatColor = color.from_gradient(rsiVortexNorm, 0, 1, colorLow, colorHigh)
heatmapDrawOk=true

if kHybrid>=0.8
    heatmapDrawOk := true
    heatColor:= color.rgb(200+kHybrid*5,0,0,60)
    //hideHeatmap:=true

if kHybrid<=-0.8
    heatmapDrawOk := true
    heatColor:=color.rgb(0,200+kHybrid*5,0,60)
    //hideHeatmap:=true

bgcolor(hideHeatmap ? na : heatColor)

// === HYBRID CROSS SIGNALS ===
crossUp   = ta.crossover(kHybrid, dHybrid)
crossDown = ta.crossunder(kHybrid, dHybrid)

// === VARIABLES TO STORE LAST BUY PRICE ===
var float lastBuyPrice = na

// === PLOTS ===
plot(kHybrid, title="Hybrid %K × RSI × MACD", color=kColor)
plot(dHybrid, title="Hybrid %D × RSI × MACD", color=dColor)
hline(0.8, "Strong Up", color=color.rgb(0, 255, 0))
hline(-0.8, "Strong Down", color=color.rgb(255, 0, 0))
hline(0.0, "Neutral", color=color.rgb(128, 128, 128))

// === ALERT CONDITIONS ===
alertcondition(crossUp, title="Sell Signal", message="🔔 Sell Signal: Momentum crossover to the downside.")
alertcondition(crossDown, title="Buy Signal", message="🔔 Buy Signal: Momentum crossover to the upside.")

// === CROSS ICONS WITH PRICE TEXT USING LABEL.NEW ===

// Store last buy price when a buy signal occurs
if (crossDown)
    lastBuyPrice := open
// Calculate and display sell signal only if profit >= 1%
decimalDifference=0.0
percentageDifference=0.0
if (crossUp)
    decimalDifference := close - lastBuyPrice
    percentageDifference := (decimalDifference / lastBuyPrice) * 100    

// Display Buy signal
if kHybrid<=-1 or percentageDifference <= -(percentDifference/2) and hideLabels==false
    label.new(bar_index, low, text="Buy: " + str.tostring(open, "#.########"), style=label.style_label_up, color=buyColor, textcolor=color.white, size=size.normal, yloc=yloc.belowbar, force_overlay=true)
//    strategy.entry("Buy", strategy.long)
   
// Only display sell label if profit is >= 1%
if (percentageDifference >= percentDifference and hideLabels==false)
//    strategy.close("Buy")  // Close the full position        
    label.new(bar_index, high, text="Sell: " + str.tostring(close, "#.########") +  "\n" + str.tostring(decimalDifference, "#.########") + "\n" + str.tostring(percentageDifference, "#.##") + "%",  style=label.style_label_down, color=sellColor, textcolor=color.white, size=size.normal, yloc=yloc.abovebar, force_overlay=true)    

