const express = require('express');
const router = express.Router();
const Leave = require('../model/Leave');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up Multer for file uploads with file type validation
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    },
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Error: File type not supported!'));
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
    fileFilter, // Use the file filter
});

// Create a new leave request
router.post('/', upload.single('attachment'), async (req, res) => {
    try {
        const newLeave = new Leave({
            ...req.body,
            attachment: req.file ? req.file.filename : null, // Save the filename of the uploaded file
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
        const updatedData = {
            ...req.body,
            attachment: req.file ? req.file.filename : undefined, // Update the attachment if a new file is uploaded
        };

        const updatedLeave = await Leave.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedLeave) return res.status(404).json({ message: 'Leave not found' });
        res.json(updatedLeave);
    } catch (error) {
        console.error('Error updating leave request:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete a leave request and its associated file
router.delete('/:id', async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Leave not found' });

        // Delete the associated file if it exists
        if (leave.attachment) {
            const filePath = path.join(uploadsDir, leave.attachment);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        }

        const deletedLeave = await Leave.findByIdAndDelete(req.params.id);
        res.json({ message: 'Leave deleted successfully' });
    } catch (error) {
        console.error('Error deleting leave request:', error);
        res.status(500).json({ message: error.message });
    }
});

// Additional route to handle file deletion (optional)
router.delete('/attachment/:filename', async (req, res) => {
    const filePath = path.join(uploadsDir, req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: 'Error deleting file', error: err });
        }
        res.json({ message: 'File deleted successfully' });
    });
});

module.exports = router;