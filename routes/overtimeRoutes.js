const express = require("express");
const Overtime = require("../model/Overtime");

const router = express.Router();

// Function to calculate predicted overtime hours
const calculatePredictedOvertimeHours = (currentOvertimeHours) => {
  const increasePercentage = 0.10; // Example: 10% increase
  return Math.round(currentOvertimeHours * (1 + increasePercentage)); // Round the predicted overtime hours
};

// Function to generate a unique employee number
const generateEmployeeNo = async () => {
  const prefix = "NGH-";
  const existingRecords = await Overtime.find().sort({ employeeNo: -1 }).limit(1);
  let nextNumber = 1;

  if (existingRecords.length > 0) {
    const lastEmployeeNo = existingRecords[0].employeeNo;
    const lastNumber = parseInt(lastEmployeeNo.split("-")[1], 10);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(4, '0')}`; // Format as EMP-XXXX
};

// Get all overtime records
router.get("/", async (req, res) => {
  try {
    const overtimes = await Overtime.find();
    res.json(overtimes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching overtime records", error: err });
  }
});

// Add a new overtime record
router.post("/", async (req, res) => {
  const { name, position, overtimeHours, approved } = req.body; // Include approved in the request body

  // Manual validation
  if (!name || !position || !overtimeHours) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Generate a unique employee number
  const employeeNo = await generateEmployeeNo();

  // Calculate predicted overtime hours
  const predictedOvertimeHours = calculatePredictedOvertimeHours(overtimeHours);

  const newOvertime = new Overtime({
    employeeNo, // Automatically generated employeeNo
    name,
    position,
    overtimeHours,
    predictedOvertimeHours, // Include predicted overtime hours
    approved: approved || false, // Set approval status, default to false
  });

  try {
    const savedOvertime = await newOvertime.save();
    res.status(201).json(savedOvertime);
  } catch (err) {
    res.status(400).json({ message: "Error adding overtime record", error: err });
  }
});

// Update an existing overtime record
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, position, overtimeHours, approved } = req.body; // Include approved in the request body

  // Manual validation
  if (!name || !position || !overtimeHours) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Calculate predicted overtime hours
  const predictedOvertimeHours = calculatePredictedOvertimeHours(overtimeHours);

  try {
    const updatedOvertime = await Overtime.findByIdAndUpdate(
      id,
      {
        name,
        position,
        overtimeHours,
        predictedOvertimeHours, // Include predicted overtime hours
        approved: approved || false, // Update approval status
      },
      { new: true }
    );

    if (!updatedOvertime) {
      return res.status(404).json({ message: "Overtime record not found" });
    }

    res.json(updatedOvertime);
  } catch (err) {
    res.status(400).json({ message: "Error updating overtime record", error: err });
  }
});

// Toggle approval status
router.put("/approve/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const overtimeRecord = await Overtime.findById(id);
    if (!overtimeRecord) {
      return res.status(404).json({ message: "Overtime record not found" });
    }

    // Toggle the approval status
    overtimeRecord.approved = !overtimeRecord.approved;
    await overtimeRecord.save();

    res.json(overtimeRecord);
  } catch (err) {
    res.status(500).json({ message: "Error updating approval status", error: err });
  }
});

// Delete an overtime record
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOvertime = await Overtime.findByIdAndDelete(id);

    if (!deletedOvertime) {
      return res.status(404).json({ message: "Overtime record not found" });
    }

    res.json({ message: "Overtime record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting overtime record", error: err });
  }
});

module.exports = router;