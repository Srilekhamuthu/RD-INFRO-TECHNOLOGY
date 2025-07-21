// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    default: 'Pending',
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', taskSchema);
