const logger = require("../utils/logger");

function predictGrowth(historicalData) {
  if (!Array.isArray(historicalData) || historicalData.length < 2) {
    return {
      slope: 0,
      intercept: 0,
      r2: 0,
      nextValue: null,
      nextDate: null,
    };
  }

  const sorted = [...historicalData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const startTime = new Date(sorted[0].date).getTime();
  const points = sorted.map((d, i) => {
    const timeOffset = (new Date(d.date).getTime() - startTime) / (1000 * 60 * 60 * 24);
    return { x: timeOffset, y: d.growth };
  });

  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
  }

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) {
    return {
      slope: 0,
      intercept: sumY / n,
      r2: 0,
      nextValue: sumY / n,
      nextDate: null,
    };
  }

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  const meanY = sumY / n;
  let ssTot = 0;
  let ssRes = 0;

  for (const p of points) {
    ssTot += Math.pow(p.y - meanY, 2);
    ssRes += Math.pow(p.y - (slope * p.x + intercept), 2);
  }

  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  const lastPoint = points[points.length - 1];
  const nextX = lastPoint.x + 1;
  const nextValue = slope * nextX + intercept;

  const lastDate = new Date(sorted[sorted.length - 1].date);
  const nextDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000);

  return {
    slope: parseFloat(slope.toFixed(6)),
    intercept: parseFloat(intercept.toFixed(4)),
    r2: parseFloat(Math.max(0, r2).toFixed(4)),
    nextValue: parseFloat(nextValue.toFixed(4)),
    nextDate: nextDate.toISOString().split("T")[0],
  };
}

function calculateMomentum(dataPoints) {
  if (!Array.isArray(dataPoints) || dataPoints.length < 2) {
    return 0;
  }

  const sorted = [...dataPoints].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const growthValues = sorted.map((d) => d.growth);
  const n = growthValues.length;

  if (n < 2) return 0;

  let roc = 0;
  if (n >= 4) {
    const recentHalf = growthValues.slice(Math.floor(n / 2));
    const olderHalf = growthValues.slice(0, Math.floor(n / 2));

    const recentAvg = recentHalf.reduce((s, v) => s + v, 0) / recentHalf.length;
    const olderAvg = olderHalf.reduce((s, v) => s + v, 0) / olderHalf.length;

    roc = olderAvg !== 0 ? ((recentAvg - olderAvg) / Math.abs(olderAvg)) * 100 : recentAvg * 10;
  } else {
    const last = growthValues[n - 1];
    const first = growthValues[0];
    roc = first !== 0 ? ((last - first) / Math.abs(first)) * 100 : last * 10;
  }

  const momentum = Math.min(100, Math.max(0, 50 + roc * 0.5));

  return parseFloat(momentum.toFixed(2));
}

function classifyStage(metrics) {
  const { currentGrowth, momentum, historicalData } = metrics;

  const growth = currentGrowth || 0;
  const mom = momentum || 0;

  let recentMomentum = 0;
  if (Array.isArray(historicalData) && historicalData.length >= 3) {
    const sorted = [...historicalData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const recent3 = sorted.slice(-3);
    const older3 = sorted.slice(0, Math.min(3, sorted.length));

    const recentAvg = recent3.reduce((s, d) => s + d.growth, 0) / recent3.length;
    const olderAvg = older3.reduce((s, d) => s + d.growth, 0) / older3.length;

    recentMomentum = recentAvg - olderAvg;
  }

  if (growth > 20 && mom > 60 && recentMomentum > 0) {
    return "Growing";
  }

  if (growth > 5 && growth <= 20 && mom > 40) {
    if (recentMomentum > 0) {
      return "Growing";
    }
    return "Mature";
  }

  if (growth > 0 && growth <= 5 && mom >= 30 && mom <= 60) {
    return "Mature";
  }

  if (growth <= 0 && mom < 40 && recentMomentum <= 0) {
    return "Declining";
  }

  if (growth < -10 || mom < 20) {
    return "Declining";
  }

  if (growth > 0 && mom < 40) {
    return "Emerging";
  }

  if (growth >= 0 && mom >= 40) {
    return "Mature";
  }

  return "Emerging";
}

function generateForecast(trendData) {
  const { historicalData, currentGrowth, momentum, stage } = trendData;

  const current = currentGrowth || 0;
  const mom = momentum || 50;
  const stageStr = stage || "Emerging";

  let momentumFactor = 0;
  if (Array.isArray(historicalData) && historicalData.length >= 2) {
    const sorted = [...historicalData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const recent = sorted.slice(-3);
    const older = sorted.slice(0, Math.max(1, sorted.length - 3));

    const recentAvg = recent.reduce((s, d) => s + d.growth, 0) / recent.length;
    const olderAvg = older.reduce((s, d) => s + d.growth, 0) / older.length;

    momentumFactor = recentAvg - olderAvg;
  }

  const growthMultiplier = {
    "Emerging": 1.3,
    "Growing": 1.1,
    "Mature": 0.9,
    "Declining": 0.6,
  }[stageStr] || 1.0;

  const shortTermGrowth = current + momentumFactor * 0.3 * growthMultiplier;
  const mediumTermGrowth = current + momentumFactor * 0.6 * growthMultiplier;
  const longTermGrowth = current + momentumFactor * 1.0 * growthMultiplier;

  const shortTerm = formatGrowthForecast(shortTermGrowth, stageStr, "short");
  const mediumTerm = formatGrowthForecast(mediumTermGrowth, stageStr, "medium");
  const longTerm = formatGrowthForecast(longTermGrowth, stageStr, "long");

  return {
    shortTerm,
    mediumTerm,
    longTerm,
    shortTermGrowth: parseFloat(shortTermGrowth.toFixed(2)),
    mediumTermGrowth: parseFloat(mediumTermGrowth.toFixed(2)),
    longTermGrowth: parseFloat(longTermGrowth.toFixed(2)),
  };
}

function formatGrowthForecast(growth, stage, horizon) {
  const direction = growth > 2 ? "increase" : growth < -2 ? "decrease" : "remain stable";
  const magnitude = Math.abs(growth);
  const intensity = magnitude > 20 ? "significant" : magnitude > 10 ? "moderate" : magnitude > 3 ? "slight" : "minimal";

  const stageContext = {
    "Emerging": "As an emerging technology",
    "Growing": "In its growth phase",
    "Mature": "In its mature phase",
    "Declining": "Facing headwinds",
  }[stage] || "The technology";

  return `${stageContext} is projected to ${direction} over the ${horizon === "short" ? "next quarter" : horizon === "medium" ? "next 6-12 months" : "next 1-3 years"}, with ${intensity} ${direction === "remain stable" ? "change" : "growth"} expected (projected rate: ${growth > 0 ? "+" : ""}${growth.toFixed(1)}%).`;
}

module.exports = {
  predictGrowth,
  calculateMomentum,
  classifyStage,
  generateForecast,
};
