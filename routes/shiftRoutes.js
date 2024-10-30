const express = require('express');
const Shift = require('../model/Shift');

const router = express.Router();

// GET all shifts
router.get('/', async (req, res) => {
    try {
        const shifts = await Shift.find();
        res.json(shifts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new shift
router.post('/', async (req, res) => {
    const shift = new Shift(req.body);
    try {
        const savedShift = await shift.save();
        res.status(201).json(savedShift);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update a shift by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedShift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedShift) {
            return res.status(404).json({ message: 'Shift not found' });
        }
        res.json(updatedShift);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a shift by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedShift = await Shift.findByIdAndDelete(req.params.id);
        if (!deletedShift) {
            return res.status(404).json({ message: 'Shift not found' });
        }
        res.json({ message: 'Shift deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
