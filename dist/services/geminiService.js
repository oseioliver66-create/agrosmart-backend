"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiagnosis = getDiagnosis;
// backend/src/services/geminiService.ts
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function getDiagnosis(cropType, diseaseLabel, confidence) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `
You are an expert agricultural scientist helping smallholder farmers in Ghana and West Africa.

A deep learning model has detected the following:
- Crop type: ${cropType}
- Disease detected: ${diseaseLabel.replace(/_/g, ' ')}
- Model confidence: ${confidence}%

Please provide a detailed diagnosis in JSON format with these exact fields:
{
  "disease_name": "Full scientific and common name of the disease",
  "severity": "low, medium, or high",
  "confidence": ${confidence},
  "symptoms": ["symptom 1", "symptom 2", "symptom 3", "symptom 4"],
  "treatments": ["treatment 1", "treatment 2", "treatment 3"],
  "prevention": ["prevention 1", "prevention 2", "prevention 3"],
  "local_products": ["locally available treatment product 1", "product 2"],
  "summary": "A 2-sentence plain language summary a farmer can understand"
}

Important:
- Use simple language a smallholder farmer can understand
- Include treatment products available in Ghana (e.g. Funguran, Ridomil, Copper Oxychloride)
- Be specific about application methods
- Return ONLY the JSON, no other text
`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean and parse JSON
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
}
