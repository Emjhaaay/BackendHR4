const express = require("express");
const Shift = require("../model/Shift");
const router = express.Router();

// Function to generate a unique employee number
const generateEmployeeNo = async () => {
  const prefix = "NGH-";
  const existingRecords = await Shift.find().sort({ employeeNo: -1 }).limit(1);
  let nextNumber = 1;

  if (existingRecords.length > 0) {
    const lastEmployeeNo = existingRecords[0].employeeNo;
    const lastNumber = parseInt(lastEmployeeNo.split("-")[1], 10);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(4, '0')}`; // Format as NGH-XXXX
};

// Get all shifts
router.get("/", async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shifts", error });
  }
});

// Add a new shift
router.post("/", async (req, res) => {
  const { employeeName, employeePosition, shiftType, timeRange, differentialRate, salary } = req.body;

  // Manual validation
  if (!employeeName || !employeePosition || !shiftType || !timeRange || !differentialRate || !salary) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const employeeNo = await generateEmployeeNo(); // Generate employee number

    const newShift = new Shift({
      employeeNo, // Include employee number
      employeeName,
      employeePosition,
      shiftType,
      differentialRate,
      salary,
      timeRange
    });

    const savedShift = await newShift.save();
    res.status(201).json(savedShift);
  } catch (error) {
    res.status(400).json({ message: "Error adding shift", error });
  }
});

// Update an existing shift
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { employeeName, employeePosition, shiftType, differentialRate, salary, timeRange } = req.body;

  // Manual validation
  if (!employeeName || !employeePosition || !shiftType || !timeRange || !differentialRate || !salary) {
    return res.status(400).json({ message: "All fields are required." });
  }

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
    res.status(400).json({ message: "Error updating shift", error });
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
    res.status(500).json({ message: "Error deleting shift", error });
  }
});

module.exports = router;