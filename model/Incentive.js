// models/Incentive.js
const mongoose = require('mongoose');

const incentiveSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    attendance: { type: Number, required: true },
    eligibleForIncentives: { type: Boolean, required: true, default: false }, // New field for eligibility
}, { timestamps: true });

module.exports = mongoose.model('Incentive', incentiveSchema);