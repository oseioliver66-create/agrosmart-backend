"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/detect.ts
const express_1 = __importDefault(require("express"));
const geminiService_1 = require("../services/geminiService");
const router = express_1.default.Router();
// POST /detect/gemini-diagnosis
router.post('/gemini-diagnosis', async (req, res) => {
    try {
        const { disease_label, crop_type, confidence } = req.body;
        if (!disease_label || !crop_type) {
            return res.status(400).json({ error: 'disease_label and crop_type are required' });
        }
        const diagnosis = await (0, geminiService_1.getDiagnosis)(crop_type, disease_label, confidence ?? 0);
        return res.json(diagnosis);
    }
    catch (error) {
        console.error('Gemini diagnosis error:', error.message);
        return res.json({
            symptoms: ['Visible lesions on leaves', 'Yellowing around affected areas', 'Reduced plant vigour'],
            treatments: ['Remove and destroy affected leaves', 'Apply appropriate fungicide', 'Improve air circulation around plants'],
            prevention: ['Use disease-resistant varieties', 'Practice crop rotation', 'Avoid overhead irrigation'],
            local_products: ['Copper-based fungicide (available at agro shops)', 'Mancozeb 80WP'],
            summary: 'Disease detected in your crop. Apply the recommended treatments promptly to prevent spread.',
        });
    }
});
exports.default = router;
