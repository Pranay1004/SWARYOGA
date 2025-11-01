import express from 'express';
import { Affirmation } from '../../models/index.js';

const router = express.Router();

// Get all affirmations
router.get('/', async (req, res) => {
  try {
    const affirmations = await Affirmation.find();
    res.json({ success: true, data: affirmations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single affirmation by ID
router.get('/:id', async (req, res) => {
  try {
    const affirmation = await Affirmation.findById(req.params.id);
    if (!affirmation) {
      return res.status(404).json({ success: false, error: 'Affirmation not found' });
    }
    res.json({ success: true, data: affirmation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new affirmation
router.post('/', async (req, res) => {
  try {
    const newAffirmation = new Affirmation(req.body);
    const savedAffirmation = await newAffirmation.save();
    res.status(201).json({ success: true, data: savedAffirmation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update an affirmation
router.put('/:id', async (req, res) => {
  try {
    const updatedAffirmation = await Affirmation.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedAffirmation) {
      return res.status(404).json({ success: false, error: 'Affirmation not found' });
    }
    res.json({ success: true, data: updatedAffirmation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete an affirmation
router.delete('/:id', async (req, res) => {
  try {
    const deletedAffirmation = await Affirmation.findByIdAndDelete(req.params.id);
    if (!deletedAffirmation) {
      return res.status(404).json({ success: false, error: 'Affirmation not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;