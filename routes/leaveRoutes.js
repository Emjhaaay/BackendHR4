const express = require('express');
const router = express.Router();
const Leave = require('../model/Leave');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/'; // Specify the directory to save files
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir); // Create the directory if it doesn't exist
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Save the file with its original name
    }
});

const upload = multer({ storage });

// Create a new leave request
router.post('/', upload.single('attachment'), async (req, res) => {
    try {
        const newLeave = new Leave({
            ...req.body,
            attachment: req.file ? req.file.filename : null, // Save the filename if provided
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

        // If a new file is provided, save the filename
        if (req.file) {
            updatedData.attachment = req.file.filename; // Update the attachment with the filename
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

        // Optionally, delete the file from the filesystem if it exists
        if (leave.attachment) {
            const filePath = path.join(__dirname, '../uploads', leave.attachment);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Delete the file
            }
        }

        const deletedLeave = await Leave.findByIdAndDelete(req.params.id);
        res.json({ message: 'Leave deleted successfully', deletedLeave });
    } catch (error) {
        console.error('Error deleting leave request:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;