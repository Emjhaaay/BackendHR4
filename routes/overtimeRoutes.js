const express = require("express");
const Overtime = require("../model/Overtime");

const router = express.Router();

// Function to calculate predicted salary
const calculatePredictedSalary = (totalSalary, overtimeHours) => {
  const increasePercentage = 0.05; // Example: 5% increase
  if (overtimeHours === 0) {
    return totalSalary; // If no overtime, predicted salary is the same as total salary
  }
  return totalSalary * (1 + increasePercentage); // Apply increase if there are overtime hours
};

// Function to calculate predicted overtime hours
const calculatePredictedOvertimeHours = (currentOvertimeHours) => {
  const increasePercentage = 0.10; // Example: 10% increase
  return Math.round(currentOvertimeHours * (1 + increasePercentage)); // Round the predicted overtime hours
};

// Get all overtime records
router.get("/", async (req, res) => {
  try {
    const overtimes = await Overtime.find();
    res.json(overtimes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching overtime records", error: err });
  }
});

// Add a new overtime record
router.post("/", async (req, res) => {
  const { name, position, baseSalary, overtimeHours, totalSalary } = req.body;

  // Manual validation
  if (!name || !position || !baseSalary || !overtimeHours || !totalSalary) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Calculate predicted salary and predicted overtime hours
  const predictedSalary = calculatePredictedSalary(totalSalary, overtimeHours);
  const predictedOvertimeHours = calculatePredictedOvertimeHours(overtimeHours);

  const newOvertime = new Overtime({
    name,
    position,
    baseSalary,
    overtimeHours,
    totalSalary,
    predictedSalary, // Include predicted salary
    predictedOvertimeHours, // Include predicted overtime hours
  });

  try {
    const savedOvertime = await newOvertime.save();
    res.status(201).json(savedOvertime);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error adding overtime record", error: err });
  }
});

// Update an existing overtime record
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, position, baseSalary, overtimeHours, totalSalary } = req.body;

  // Manual validation
  if (!name || !position || !baseSalary || !overtimeHours || !totalSalary) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Calculate predicted salary and predicted overtime hours
  const predictedSalary = calculatePredictedSalary(totalSalary, overtimeHours);
  const predictedOvertimeHours = calculatePredictedOvertimeHours(overtimeHours);

  try {
    const updatedOvertime = await Overtime.findByIdAndUpdate(
      id,
      {
        name,
        position,
        baseSalary,
        overtimeHours,
        totalSalary,
        predictedSalary, // Include predicted salary
        predictedOvertimeHours, // Include predicted overtime hours
      },
      { new: true }
    );

    if (!updatedOvertime) {
      return res.status(404).json({ message: "Overtime record not found" });
    }

    res.json(updatedOvertime);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating overtime record", error: err });
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
    res
      .status(500)
      .json({ message: "Error deleting overtime record", error: err });
  }
});

module.exports = router;