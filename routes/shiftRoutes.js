const express = require("express");
const Shift = require("../model/Shift");
const router = express.Router();

// Get all shifts
router.get("/", async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shifts" });
  }
});

// Add a new shift
router.post("/", async (req, res) => {
  const { employeeName, employeePosition, shiftType, differentialRate, salary, timeRange } = req.body;

  try {
    const newShift = new Shift({
      employeeName,
      employeePosition,
      shiftType,
      differentialRate,
      salary,
      timeRange
    });

    await newShift.save();
    res.status(201).json(newShift);
  } catch (error) {
    res.status(400).json({ message: "Error adding shift" });
  }
});

// Update an existing shift
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { employeeName, employeePosition, shiftType, differentialRate, salary, timeRange } = req.body;

  try {
    const updatedShift = await Shift.findByIdAndUpdate(
      id,
      { employeeName, employeePosition, shiftType, differentialRate, salary, timeRange },
      { new: true }
    );

    if (!updatedShift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.json(updatedShift);
  } catch (error) {
    res.status(400).json({ message: "Error updating shift" });
  }
});

// Delete a shift
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedShift = await Shift.findByIdAndDelete(id);

    if (!deletedShift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.json({ message: "Shift deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting shift" });
  }
});

module.exports = router;
