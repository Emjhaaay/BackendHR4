const express = require('express');
const router = express.Router();
const Leave = require('../model/Leave');
const multer = require('multer');
const cloudinary = require('cloudinary').v2; // Import Cloudinary
const streamifier = require('streamifier'); // To handle streams for Cloudinary

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dvkz5ee15', // Your Cloudinary cloud name
    api_key: '359858671765997', // Your Cloudinary API key
    api_secret: 'RlggJo2ntHT2HG4g20oilyoNF3k' // Your Cloudinary API secret
});

// Set up Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Create a new leave request
router.post('/', upload.single('attachment'), async (req, res) => {
    try {
        let attachmentUrl = null;

        // Upload to Cloudinary if a file is provided
        if (req.file) {
            const streamUpload = (file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream((error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    });
                    streamifier.createReadStream(file.buffer).pipe(stream);
                });
            };

            const result = await streamUpload(req.file);
            attachmentUrl = result.secure_url; // Get the URL of the uploaded file
        }

        const newLeave = new Leave({
            ...req.body,
            attachment: attachmentUrl, // Save the URL of the uploaded file
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

        // Upload to Cloudinary if a new file is provided
        if (req.file) {
            const streamUpload = (file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream((error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    });
                    streamifier.createReadStream(file.buffer).pipe(stream);
                });
            };

            const result = await streamUpload(req.file);
            updatedData.attachment = result.secure_url; // Update the attachment URL
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

        // If there's an attachment, delete it from Cloudinary
        if (leave.attachment) {
            const publicId = leave.attachment.split('/').pop().split('.')[0]; // Extract public ID from URL
            await cloudinary.uploader.destroy(publicId); // Delete from Cloudinary
        }

        const deletedLeave = await Leave.findByIdAndDelete(req.params.id);
        res.json({ message: 'Leave deleted successfully' });
    } catch (error) {
        console.error('Error deleting leave request:', error);
        res.status(500).json({ message: error.message });
    }
});

// Optional: Additional route to handle file deletion (not needed if using Cloudinary)
router.delete('/attachment/:filename', async (req, res) => {
    const publicId = req.params.filename.split('.')[0]; // Extract public ID from filename
    try {
        await cloudinary.uploader.destroy(publicId); // Delete from Cloudinary
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Error deleting file', error: err });
    }
});

module.exports = router;