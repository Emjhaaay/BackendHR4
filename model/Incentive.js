// models/Incentive.js
const mongoose = require('mongoose');

const incentiveSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    incentives: { type: Number, required: true },
    totalSalary: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Incentive', incentiveSchema);
