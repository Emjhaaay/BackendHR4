const mongoose = require("mongoose");

const overtimeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    overtimeHours: { type: Number, required: true },
    totalSalary: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Overtime", overtimeSchema);
