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
