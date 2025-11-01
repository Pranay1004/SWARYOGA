import express from 'express';
import { DiamondPerson } from '../../models/index.js';

const router = express.Router();

// Get all diamond people
router.get('/', async (req, res) => {
  try {
    const diamondPeople = await DiamondPerson.find();
    res.json({ success: true, data: diamondPeople });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single diamond person by ID
router.get('/:id', async (req, res) => {
  try {
    const diamondPerson = await DiamondPerson.findById(req.params.id);
    if (!diamondPerson) {
      return res.status(404).json({ success: false, error: 'Diamond person not found' });
    }
    res.json({ success: true, data: diamondPerson });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new diamond person
router.post('/', async (req, res) => {
  try {
    const newDiamondPerson = new DiamondPerson(req.body);
    const savedDiamondPerson = await newDiamondPerson.save();
    res.status(201).json({ success: true, data: savedDiamondPerson });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update a diamond person
router.put('/:id', async (req, res) => {
  try {
    const updatedDiamondPerson = await DiamondPerson.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedDiamondPerson) {
      return res.status(404).json({ success: false, error: 'Diamond person not found' });
    }
    res.json({ success: true, data: updatedDiamondPerson });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete a diamond person
router.delete('/:id', async (req, res) => {
  try {
    const deletedDiamondPerson = await DiamondPerson.findByIdAndDelete(req.params.id);
    if (!deletedDiamondPerson) {
      return res.status(404).json({ success: false, error: 'Diamond person not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;