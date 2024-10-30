const express = require('express');
const router = express.Router();
const Leave = require('../model/Leave');

// Create a new leave request
router.post('/', async (req, res) => {
    try {
        const newLeave = new Leave(req.body);
        const savedLeave = await newLeave.save();
        res.status(201).json(savedLeave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all leave requests
router.get('/', async (req, res) => {
    try {
        const leaves = await Leave.find();
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific leave request by ID
router.get('/:id', async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Leave not found' });
        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a leave request
router.put('/:id', async (req, res) => {
    try {
        const updatedLeave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLeave) return res.status(404).json({ message: 'Leave not found' });
        res.json(updatedLeave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a leave request
router.delete('/:id', async (req, res) => {
    try {
        const deletedLeave = await Leave.findByIdAndDelete(req.params.id);
        if (!deletedLeave) return res.status(404).json({ message: 'Leave not found' });
        res.json({ message: 'Leave deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
