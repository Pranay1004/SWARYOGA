import express from 'express';
import { Word } from '../../models/index.js';

const router = express.Router();

// Get all words
router.get('/', async (req, res) => {
  try {
    const words = await Word.find();
    res.json({ success: true, data: words });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single word by ID
router.get('/:id', async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    if (!word) {
      return res.status(404).json({ success: false, error: 'Word not found' });
    }
    res.json({ success: true, data: word });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get words by date range
router.get('/date-range', async (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ success: false, error: 'Start and end dates are required' });
    }
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + 1); // Include the end date
    
    const words = await Word.find({
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });
    
    res.json({ success: true, data: words });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new word
router.post('/', async (req, res) => {
  try {
    const newWord = new Word(req.body);
    const savedWord = await newWord.save();
    res.status(201).json({ success: true, data: savedWord });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update a word
router.put('/:id', async (req, res) => {
  try {
    const updatedWord = await Word.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedWord) {
      return res.status(404).json({ success: false, error: 'Word not found' });
    }
    res.json({ success: true, data: updatedWord });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete a word
router.delete('/:id', async (req, res) => {
  try {
    const deletedWord = await Word.findByIdAndDelete(req.params.id);
    if (!deletedWord) {
      return res.status(404).json({ success: false, error: 'Word not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;