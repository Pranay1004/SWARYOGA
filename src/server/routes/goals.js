import express from 'express';
import { Goal } from '../../models/index.js';

const router = express.Router();

// Get all goals
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single goal by ID
router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get goals by date range
router.get('/date-range', async (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ success: false, error: 'Start and end dates are required' });
    }
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const goals = await Goal.find({
      $or: [
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        { 
          $and: [
            { startDate: { $lte: startDate } },
            { endDate: { $gte: endDate } }
          ]
        }
      ]
    });
    
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new goal
router.post('/', async (req, res) => {
  try {
    const newGoal = new Goal(req.body);
    const savedGoal = await newGoal.save();
    res.status(201).json({ success: true, data: savedGoal });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update a goal
router.put('/:id', async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedGoal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    res.json({ success: true, data: updatedGoal });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete a goal
router.delete('/:id', async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
    if (!deletedGoal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;