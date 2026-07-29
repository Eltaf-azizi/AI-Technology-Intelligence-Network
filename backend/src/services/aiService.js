const logger = require("../utils/logger");
const sentimentAnalysis = require("./sentimentAnalysis");
const trendPrediction = require("./trendPrediction");

const TECH_KEYWORDS = {
  "artificial-intelligence": ["artificial intelligence", "ai ", " ai", "general ai", "agi", "machine consciousness"],
  "machine-learning": ["machine learning", "ml ", " ml", "supervised learning", "unsupervised learning", "reinforcement learning", "neural network"],
  "deep-learning": ["deep learning", "cnn", "rnn", "lstm", "transformer architecture", "deep neural", "gan ", "autoencoder"],
  "nlp": ["natural language processing", "nlp", "language model", "chatbot", "text classification", "named entity", "sentiment analysis", "tokenization"],
  "computer-vision": ["computer vision", "image recognition", "object detection", "image segmentation", "visual ai", "opencv"],
  "robotics": ["robotics", "robot", "autonomous vehicle", "drone", "manipulator", "ros ", " actuator"],
  "data-science": ["data science", "data analytics", "big data", "data pipeline", "etl", "data lake", "data warehouse"],
  "cloud-computing": ["cloud computing", "aws", "azure", "gcp", "cloud native", "serverless", "kubernetes", "docker"],
  "cybersecurity": ["cybersecurity", "cyber security", "infosec", "threat detection", "penetration testing", "zero trust", "encryption"],
  "blockchain": ["blockchain", "distributed ledger", "smart contract", "defi", "web3", "cryptocurrency", "nft"],
  "quantum-computing": ["quantum computing", "qubit", "quantum supremacy", "quantum algorithm", "quantum error correction", "superposition"],
  "iot": ["internet of things", "iot", "smart home", "embedded system", "sensor network", "edge device"],
  "ar-vr": ["augmented reality", "virtual reality", "ar headset", "vr headset", "mixed reality", "spatial computing"],
  "biotech": ["biotech", "bioinformatics", "gene editing", "crispr", "drug discovery", "genomic", "protein folding"],
  "fintech": ["fintech", "financial technology", "digital payment", "robo-advisor", "blockchain finance", "open banking"],
};

async function analyzeSentiment(text) {
  try {
    const result = sentimentAnalysis.analyzeText(text);
    return {
      score: result.score,
      label: result.label,
      confidence: result.confidence,
    };
  } catch (error) {
    logger.error("AI sentiment analysis error", { error: error.message });
    return { score: 0, label: "neutral", confidence: 0.3 };
  }
}

async function predictTrend(historicalData) {
  try {
    if (!Array.isArray(historicalData) || historicalData.length < 2) {
      return {
        prediction: null,
        confidence: 0,
        direction: "insufficient-data",
      };
    }

    const sortedData = [...historicalData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const growthPoints = sortedData.map((d) => d.growth);
    const prediction = trendPrediction.predictGrowth(sortedData);
    const momentum = trendPrediction.calculateMomentum(sortedData);
    const stage = trendPrediction.classifyStage({
      currentGrowth: growthPoints[growthPoints.length - 1],
      momentum,
      historicalData: sortedData,
    });

    const forecast = trendPrediction.generateForecast({
      historicalData: sortedData,
      currentGrowth: growthPoints[growthPoints.length - 1],
      momentum,
      stage,
    });

    return {
      prediction: prediction,
      momentum,
      stage,
      forecast,
      confidence: Math.min(0.5 + sortedData.length * 0.05, 0.95),
      direction: prediction.slope > 0 ? "upward" : prediction.slope < 0 ? "downward" : "stable",
    };
  } catch (error) {
    logger.error("AI trend prediction error", { error: error.message });
    return {
      prediction: null,
      confidence: 0,
      direction: "error",
    };
  }
}

async function generateInsights(technology) {
  try {
    const techLower = (technology || "").toLowerCase();
    const insights = [];

    for (const [category, keywords] of Object.entries(TECH_KEYWORDS)) {
      if (keywords.some((kw) => techLower.includes(kw) || category.includes(techLower))) {
        insights.push({
          category,
          relevance: "high",
          context: `${technology} falls within the ${category} domain.`,
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        category: "general",
        relevance: "medium",
        context: `${technology} is tracked across general technology topics.`,
      });
    }

    const summary = insights
      .map((i) => i.context)
      .join(" ");

    return {
      technology,
      insights,
      summary,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    logger.error("AI insight generation error", { technology, error: error.message });
    return {
      technology,
      insights: [],
      summary: `Unable to generate insights for ${technology}`,
      generatedAt: new Date().toISOString(),
    };
  }
}

function extractTechnologies(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  const lowerText = text.toLowerCase();
  const found = new Set();

  for (const [category, keywords] of Object.entries(TECH_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        found.add(category);
        break;
      }
    }
  }

  const additionalTerms = [
    "gpt", "bert", "llm", "large language model", "diffusion model",
    "federated learning", "mlops", "dataOps", "devops",
    "microservices", "api", "saas", "paas", "iaas",
    "edge computing", "5g", "6g", "neuromorphic",
    "optical computing", "photonic", "synthetic biology",
    "digital twin", "metaverse", "web3", "defi",
    "zero-knowledge proof", "homomorphic encryption",
  ];

  for (const term of additionalTerms) {
    if (lowerText.includes(term)) {
      found.add(term.replace(/\s+/g, "-"));
    }
  }

  return [...found];
}

module.exports = {
  analyzeSentiment,
  predictTrend,
  generateInsights,
  extractTechnologies,
  summarizeContent,
};
