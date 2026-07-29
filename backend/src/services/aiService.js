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
