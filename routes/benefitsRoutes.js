// routes/benefitsRoutes.js
const express = require('express');
const router = express.Router();
const Benefits = require('../model/Benefits');

// Get all benefits
router.get('/', async (req, res) => {
  try {
    const benefits = await Benefits.find();
    res.json(benefits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new benefit entry
router.post('/', async (req, res) => {
  const { employeeName, employeePosition, sss, pagIbig, philHealth, leave, thirteenthMonth } = req.body;

  const newBenefit = new Benefits({
    employeeName,
    employeePosition,
    sss,
    pagIbig,
    philHealth,
    leave,
    thirteenthMonth,
  });

  try {
    const savedBenefit = await newBenefit.save();
    res.status(201).json(savedBenefit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a benefit entry
router.put('/:id', async (req, res) => {
  const { employeeName, employeePosition, sss, pagIbig, philHealth, leave, thirteenthMonth } = req.body;

  try {
    const updatedBenefit = await Benefits.findByIdAndUpdate(
      req.params.id,
      { employeeName, employeePosition, sss, pagIbig, philHealth, leave, thirteenthMonth },
      { new: true }
    );
    res.json(updatedBenefit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a benefit entry
router.delete('/:id', async (req, res) => {
  try {
    await Benefits.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
