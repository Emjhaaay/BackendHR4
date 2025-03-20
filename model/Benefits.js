const mongoose = require("mongoose");

const BenefitsSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    employeePosition: { type: String, required: true },
    sss: { type: Boolean, default: false },
    hazardPay: { type: Boolean, default: false }, // Updated from pagIbig
    holidayIncentives: { type: Boolean, default: false }, // Updated from philHealth
    leave: { type: Boolean, default: false },
    thirteenthMonth: { type: Boolean, default: false },
    retirement: { type: Boolean, default: false }, // New field for retirement benefit
  },
  { timestamps: true }
);

const Benefits = mongoose.model("Benefits", BenefitsSchema);
module.exports = Benefits;