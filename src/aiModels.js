// Lightweight, explainable ML-style predictors for pricing and negotiation.

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toInteger(value, fallback = 0) {
  const parsed = Number.parseInt(String(value).replace(/[^\d]/g, ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function categoryVolatility(category) {
  const map = {
    groceries: 0.012,
    stationery: 0.008,
    household: 0.01
  };
  return map[category] || 0.009;
}

function syntheticPriceHistory(product) {
  const base = product.price;
  const volatility = categoryVolatility(product.category);
  const nameBias = (product.name.length % 6) / 1000;
  const drift = (product.vendor.rating - 4.4) * 0.002 + nameBias;

  return Array.from({ length: 12 }, (_, i) => {
    const wave = Math.sin(i * 0.7 + base / 1000) * base * volatility;
    const trend = base * drift * (i - 5);
    return Math.max(1, Math.round(base + trend + wave));
  });
}

function linearRegressionNext(values) {
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((acc, value) => acc + value, 0);
  const sumXY = values.reduce((acc, value, x) => acc + x * value, 0);
  const sumX2 = values.reduce((acc, _, x) => acc + x * x, 0);
  const denominator = n * sumX2 - sumX * sumX;
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  return intercept + slope * n;
}

function movingAverage(values, windowSize = 4) {
  const start = Math.max(0, values.length - windowSize);
  const slice = values.slice(start);
  return slice.reduce((acc, value) => acc + value, 0) / Math.max(1, slice.length);
}

export function predictProductSignals(product) {
  const history = syntheticPriceHistory(product);
  const currentPrice = product.price;

  const linearPred = linearRegressionNext(history);
  const movingPred = movingAverage(history, 4);
  const ensembleNext = Math.round(linearPred * 0.6 + movingPred * 0.4);

  const deltaPct = ((ensembleNext - currentPrice) / currentPrice) * 100;
  const trend = deltaPct >= 0 ? 'Bullish' : 'Bearish';
  const confidence = Math.round(clamp(76 + Math.abs(deltaPct) * 4 + product.vendor.rating * 2, 70, 95));

  const stockUnits = toInteger(product.stock, 100);
  const scarcityScore = clamp((800 - stockUnits) / 800, 0, 1);
  const demandIndex = clamp(
    55 + scarcityScore * 18 + product.vendor.rating * 4 + (product.category === 'groceries' ? 6 : 0),
    45,
    92
  );

  return {
    trend,
    confidence,
    demandIndex: Math.round(demandIndex),
    forecastPrice: ensembleNext,
    deltaPct: Number(deltaPct.toFixed(1)),
    rationale: `Ensemble model (linear regression + moving average) predicts ${deltaPct >= 0 ? 'upside' : 'cooling'} next week.`
  };
}

export function suggestCounterOffer({ product, vendorOffer, yourLastOffer }) {
  const signals = predictProductSignals(product);
  const anchor = signals.forecastPrice;
  const midpoint = (vendorOffer + yourLastOffer) / 2;

  const demandPressure = (signals.demandIndex - 60) * 0.25;
  const fairPrice = midpoint + demandPressure + (anchor - product.price) * 0.15;
  const suggested = Math.round(clamp(fairPrice, vendorOffer - 70, vendorOffer + 40) / 10) * 10;

  return {
    suggestedPrice: suggested,
    confidence: clamp(signals.confidence - 3, 65, 94),
    explanation: `Targeted near ₹${Math.round(anchor).toLocaleString('en-IN')} fair value with demand index ${signals.demandIndex}.`
  };
}

export function predictVendorResponse({ vendorOffer, yourCounter, product }) {
  const signals = predictProductSignals(product);
  const concessionBias = signals.demandIndex > 70 ? 0.42 : 0.5;
  const response = vendorOffer - (vendorOffer - yourCounter) * concessionBias;
  return Math.round(clamp(response, yourCounter, vendorOffer + 20) / 10) * 10;
}
