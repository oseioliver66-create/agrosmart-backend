// backend/src/routes/detect.ts
import express from 'express';
import { getDiagnosis } from '../services/geminiService';

const router = express.Router();

// POST /detect/gemini-diagnosis
router.post('/gemini-diagnosis', async (req, res) => {
  try {
    const { disease_label, crop_type, confidence } = req.body;

    if (!disease_label || !crop_type) {
      return res.status(400).json({ error: 'disease_label and crop_type are required' });
    }

    const diagnosis = await getDiagnosis(crop_type, disease_label, confidence ?? 0);
    return res.json(diagnosis);

  } catch (error: any) {
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

export default router;