const express = require('express');
const router = express.Router();
const Leave = require('../model/Leave');
const multer = require('multer');

// Set up Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Create a new leave request
router.post('/', upload.single('attachment'), async (req, res) => {
    try {
        const newLeave = new Leave({
            ...req.body,
            attachment: req.file ? req.file.originalname : null, // Save the original filename if provided
        });
        const savedLeave = await newLeave.save();
        res.status(201).json(savedLeave);
    } catch (error) {
        console.error('Error creating leave request:', error);
        res.status(400).json({ message: error.message });
    }
});

// Get all leave requests
router.get('/', async (req, res) => {
    try {
        const leaves = await Leave.find();
        res.json(leaves);
    } catch (error) {
        console.error('Error fetching leave requests:', error);
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
        console.error('Error fetching leave request:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update a leave request
router.put('/:id', upload.single('attachment'), async (req, res) => {
    try {
        let updatedData = {
            ...req.body,
        };

        // If a new file is provided, save the original filename
        if (req.file) {
            updatedData.attachment = req.file.originalname; // Update the attachment with the original filename
        }

        const updatedLeave = await Leave.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedLeave) return res.status(404).json({ message: 'Leave not found' });
        res.json(updatedLeave);
    } catch (error) {
        console.error('Error updating leave request:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete a leave request
router.delete('/:id', async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Leave not found' });

        const deletedLeave = await Leave.findByIdAndDelete(req.params.id);
        res.json({ message: 'Leave deleted successfully' });
    } catch (error) {
        console.error('Error deleting leave request:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;