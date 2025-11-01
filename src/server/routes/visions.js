import express from 'express';
import { Vision } from '../../models/index.js';

const router = express.Router();

// Get all visions
router.get('/', async (req, res) => {
  try {
    const visions = await Vision.find();
    res.json({ success: true, data: visions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single vision by ID
router.get('/:id', async (req, res) => {
  try {
    const vision = await Vision.findById(req.params.id);
    if (!vision) {
      return res.status(404).json({ success: false, error: 'Vision not found' });
    }
    res.json({ success: true, data: vision });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new vision
router.post('/', async (req, res) => {
  try {
    const newVision = new Vision(req.body);
    const savedVision = await newVision.save();
    res.status(201).json({ success: true, data: savedVision });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update a vision
router.put('/:id', async (req, res) => {
  try {
    const updatedVision = await Vision.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedVision) {
      return res.status(404).json({ success: false, error: 'Vision not found' });
    }
    res.json({ success: true, data: updatedVision });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete a vision
router.delete('/:id', async (req, res) => {
  try {
    const deletedVision = await Vision.findByIdAndDelete(req.params.id);
    if (!deletedVision) {
      return res.status(404).json({ success: false, error: 'Vision not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;