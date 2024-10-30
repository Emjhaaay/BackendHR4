const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    employeePosition: { type: String, required: true },
    shiftType: { type: String, required: true },
    differentialRate: { type: Number, required: true },
    salary: { type: Number, required: true },
  },
  { timestamps: true }
);

const Shift = mongoose.model("Shift", shiftSchema);
module.exports = Shift;
