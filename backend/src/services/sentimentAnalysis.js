const POSITIVE_TECH_KEYWORDS = new Map([
  ["breakthrough", 0.8],
  ["innovative", 0.7],
  ["revolutionary", 0.85],
  ["transformative", 0.75],
  ["advancement", 0.6],
  ["growth", 0.5],
  ["improvement", 0.5],
  ["success", 0.7],
  ["excellent", 0.8],
  ["outstanding", 0.8],
  ["exceptional", 0.8],
  ["leading", 0.5],
  ["leading-edge", 0.7],
  ["cutting-edge", 0.7],
  ["state-of-the-art", 0.7],
  ["promising", 0.6],
  ["opportunity", 0.5],
  ["efficient", 0.5],
  ["effective", 0.5],
  ["scalable", 0.4],
  ["robust", 0.5],
  ["reliable", 0.5],
  ["secure", 0.4],
  ["fast", 0.4],
  ["powerful", 0.5],
  ["optimize", 0.5],
  ["enhance", 0.5],
  ["accelerate", 0.6],
  ["boost", 0.5],
  ["surge", 0.6],
  ["boom", 0.6],
  ["profit", 0.5],
  ["revenue", 0.3],
  ["adoption", 0.4],
  ["milestone", 0.6],
  ["award", 0.6],
  ["patent", 0.5],
  ["funding", 0.4],
  ["investment", 0.4],
  ["partnership", 0.4],
  ["launch", 0.5],
  ["release", 0.4],
  ["deploy", 0.4],
  ["integration", 0.3],
  ["award-winning", 0.7],
  ["best-in-class", 0.7],
  ["industry-leading", 0.7],
  ["groundbreaking", 0.8],
  ["pioneering", 0.7],
  ["unprecedented", 0.6],
  ["remarkable", 0.7],
  ["impressive", 0.7],
  ["superior", 0.6],
  ["flagship", 0.5],
  ["premium", 0.4],
  ["next-generation", 0.6],
  ["future-proof", 0.5],
  ["sustainable", 0.4],
  ["green", 0.3],
  ["eco-friendly", 0.4],
  ["accessible", 0.4],
  ["user-friendly", 0.5],
  ["intuitive", 0.5],
  ["streamlined", 0.4],
  ["seamless", 0.5],
  ["proven", 0.5],
  ["trusted", 0.5],
]);

const NEGATIVE_TECH_KEYWORDS = new Map([
  ["failure", -0.8],
  ["fail", -0.7],
  ["failing", -0.7],
  ["vulnerability", -0.7],
  ["vulnerable", -0.6],
  ["breach", -0.8],
  ["hack", -0.8],
  ["hacked", -0.8],
  ["compromised", -0.7],
  ["breach", -0.8],
  ["attack", -0.7],
  ["malware", -0.8],
  ["ransomware", -0.9],
  ["phishing", -0.7],
  ["exploit", -0.6],
  ["bug", -0.4],
  ["glitch", -0.4],
  ["outage", -0.7],
  ["downtime", -0.6],
  ["crash", -0.7],
  ["crashed", -0.7],
  ["decline", -0.5],
  ["declining", -0.5],
  ["decrease", -0.4],
  ["loss", -0.5],
  ["losses", -0.6],
  ["losses", -0.6],
  ["fail", -0.7],
  ["failed", -0.7],
  ["delay", -0.4],
  ["delayed", -0.4],
  ["concern", -0.4],
  ["concerns", -0.5],
  ["risk", -0.4],
  ["risky", -0.5],
  ["danger", -0.6],
  ["dangerous", -0.6],
  ["threat", -0.6],
  ["threatening", -0.6],
  ["worry", -0.5],
  ["worried", -0.5],
  ["problem", -0.5],
  ["problematic", -0.5],
  ["issue", -0.3],
  ["issues", -0.4],
  ["trouble", -0.5],
  ["controversy", -0.6],
  ["scandal", -0.8],
  ["fraud", -0.9],
  ["lawsuit", -0.6],
  ["litigation", -0.5],
  ["layoff", -0.6],
  ["layoffs", -0.7],
  ["shutdown", -0.7],
  ["shut down", -0.7],
  ["cancel", -0.5],
  ["canceled", -0.5],
  ["obsolete", -0.5],
  ["outdated", -0.5],
  ["deprecated", -0.4],
  ["slow", -0.3],
  ["sluggish", -0.4],
  ["underperform", -0.5],
  ["overpriced", -0.5],
  ["underwhelming", -0.5],
  ["disappointing", -0.6],
  ["unsustainable", -0.6],
  ["recession", -0.6],
  ["inflation", -0.4],
  ["volatile", -0.4],
  ["unstable", -0.5],
  ["uncertain", -0.3],
  ["uncertainty", -0.4],
  ["slump", -0.5],
  ["downturn", -0.5],
  ["setback", -0.5],
  ["regression", -0.5],
  ["decay", -0.5],
]);

const INTENSIFIERS = new Map([
  ["very", 1.3],
  ["extremely", 1.5],
  ["incredibly", 1.4],
  ["highly", 1.3],
  ["significantly", 1.3],
  ["substantially", 1.2],
  ["tremendously", 1.4],
  ["remarkably", 1.3],
  ["exceptionally", 1.4],
  ["particularly", 1.2],
  ["especially", 1.3],
  ["major", 1.2],
  ["massive", 1.3],
  ["huge", 1.3],
  ["dramatic", 1.3],
  ["severe", 1.3],
  ["critical", 1.2],
  ["catastrophic", 1.5],
  ["devastating", 1.5],
]);

const NEGATORS = new Set([
  "not", "no", "never", "neither", "nor", "hardly", "barely",
  "scarcely", "seldom", "rarely", "doesn't", "don't", "didn't",
  "won't", "wouldn't", "couldn't", "shouldn't", "isn't", "aren't",
  "wasn't", "weren't", "hasn't", "haven't", "hadn't",
]);

function analyzeText(text) {
  if (!text || typeof text !== "string") {
    return { score: 0, label: "neutral", confidence: 0.3 };
  }

  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  if (sentences.length === 0) {
    return { score: 0, label: "neutral", confidence: 0.3 };
  }

  let totalScore = 0;
  let matchedWords = 0;
  const totalWords = text.toLowerCase().split(/\s+/).length;

  for (const sentence of sentences) {
    const words = sentence.toLowerCase().match(/[a-z'-]+/g) || [];
    let sentenceScore = 0;
    let sentenceMatched = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      let multiplier = 1;
      for (let j = Math.max(0, i - 2); j < i; j++) {
        if (NEGATORS.has(words[j])) {
          multiplier *= -1;
        }
        if (INTENSIFIERS.has(words[j])) {
          multiplier *= INTENSIFIERS.get(words[j]);
        }
      }

      if (POSITIVE_TECH_KEYWORDS.has(word)) {
        sentenceScore += POSITIVE_TECH_KEYWORDS.get(word) * multiplier;
        sentenceMatched++;
      } else if (NEGATIVE_TECH_KEYWORDS.has(word)) {
        sentenceScore += NEGATIVE_TECH_KEYWORDS.get(word) * multiplier;
        sentenceMatched++;
      }

      const bigram = i > 0 ? `${words[i - 1]} ${word}` : "";
      if (bigram && POSITIVE_TECH_KEYWORDS.has(bigram)) {
        sentenceScore += POSITIVE_TECH_KEYWORDS.get(bigram) * multiplier;
        sentenceMatched++;
      } else if (bigram && NEGATIVE_TECH_KEYWORDS.has(bigram)) {
        sentenceScore += NEGATIVE_TECH_KEYWORDS.get(bigram) * multiplier;
        sentenceMatched++;
      }
    }

    totalScore += sentenceScore;
    matchedWords += sentenceMatched;
  }

  const normalizedScore = sentences.length > 0
    ? Math.max(-1, Math.min(1, totalScore / sentences.length))
    : 0;

  const matchRatio = totalWords > 0 ? matchedWords / totalWords : 0;
  const confidence = Math.min(0.5 + matchRatio * 5 + sentences.length * 0.02, 0.95);

  let label;
  if (normalizedScore > 0.1) {
    label = "positive";
  } else if (normalizedScore < -0.1) {
    label = "negative";
  } else {
    label = "neutral";
  }

  return {
    score: parseFloat(normalizedScore.toFixed(4)),
    label,
    confidence: parseFloat(confidence.toFixed(4)),
  };
}

function analyzeBatch(texts) {
  if (!Array.isArray(texts)) {
    return [];
  }

  return texts.map((text, index) => {
    const result = analyzeText(text);
    return {
      index,
      ...result,
    };
  });
}

function getLexicon() {
  return {
    positive: Object.fromEntries(POSITIVE_TECH_KEYWORDS),
    negative: Object.fromEntries(NEGATIVE_TECH_KEYWORDS),
    intensifiers: Object.fromEntries(INTENSIFIERS),
    negators: [...NEGATORS],
  };
}


module.exports = {
  analyzeText,
  analyzeBatch,
  getLexicon,
  calculateAggregate,
};
