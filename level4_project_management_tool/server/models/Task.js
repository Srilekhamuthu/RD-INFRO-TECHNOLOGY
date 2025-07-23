const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Done'], default: 'Pending' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deadline: { type: Date } // ⏰ Deadline
});

module.exports = mongoose.model('Task', taskSchema);
