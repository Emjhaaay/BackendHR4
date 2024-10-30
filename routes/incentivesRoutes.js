// incentivesRoutes.js
const express = require('express');
const router = express.Router();
const Incentive = require('../model/Incentive'); // Make sure to create the Incentive model

// Create a new incentive
router.post('/', async (req, res) => {
    try {
        const newIncentive = new Incentive(req.body);
        const savedIncentive = await newIncentive.save();
        res.status(201).json(savedIncentive);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all incentives
router.get('/', async (req, res) => {
    try {
        const incentives = await Incentive.find();
        res.json(incentives);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an incentive
router.put('/:id', async (req, res) => {
    try {
        const updatedIncentive = await Incentive.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedIncentive);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an incentive
router.delete('/:id', async (req, res) => {
    try {
        await Incentive.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
