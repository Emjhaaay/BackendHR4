// models/Overtime.js
const mongoose = require("mongoose");

const overtimeSchema = new mongoose.Schema(
  {
    employeeNo: { type: String, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    overtimeHours: { type: Number, required: true },
    predictedOvertimeHours: { type: Number, required: true },
    approved: { type: Boolean, default: false }, // New field for approval status
  },
  { timestamps: true }
);

module.exports = mongoose.model("Overtime", overtimeSchema);