import express from 'express';
import User from '../models/User.js';
import Score from '../models/Score.js';
import { calculateScore } from '../utils/calculateScore.js';

const router = express.Router();


router.post('/add-score', async (req, res) => {
  try {
    const { user_id, Basic_verification, Background_check, Experience, Positive_behavior } =
      req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    const flags = [
      Basic_verification,
      Background_check,
      Experience,
      Positive_behavior
    ];

    if (flags.some((v) => v !== 0 && v !== 1)) {
      return res.status(400).json({ message: 'All score fields must be 0 or 1' });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { breakdown, finalScore } = calculateScore({
      Basic_verification,
      Background_check,
      Experience,
      Positive_behavior
    });

    const scoreDoc = await Score.create({
      user_id,
      Basic_verification,
      Background_check,
      Experience,
      Positive_behavior,
      breakdown,
      finalScore
    });

    return res.status(201).json({
      user_id: scoreDoc.user_id.toString(),
      breakdown: scoreDoc.breakdown,
      finalScore: scoreDoc.finalScore
    });
  } catch (error) {
    console.error('Error in /add-score:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/score/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const scoreDoc = await Score.findOne({ user_id }).sort({ createdAt: -1 });

    if (!scoreDoc) {
      return res.status(404).json({ message: 'Score not found for this user' });
    }

    return res.json({
      user_id: scoreDoc.user_id.toString(),
      breakdown: scoreDoc.breakdown,
      finalScore: scoreDoc.finalScore
    });
  } catch (error) {
    console.error('Error in /score/:user_id:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
