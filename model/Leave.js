// models/Leave.js
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeePosition: { type: String, required: true },
  leaveType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: 'Pending' },
  attachment: { type: String }, // Store the filename of the attachment
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);