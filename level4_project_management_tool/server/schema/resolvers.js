const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const JWT_SECRET = "supersecret123";

const resolvers = {
  Query: {
    hello: () => "Hello, world!",
    getUsers: async () => await User.find(),
    getProjects: async () => await Project.find().populate('userId'),
    getTasks: async () => await Task.find().populate('projectId').populate('assignedTo')
  },

  Mutation: {
    register: async (_, { username, email, password, role }) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error('Email already registered');
      const hashedPassword = await bcrypt.hash(password, 10);
      return await new User({ username, email, password: hashedPassword, role }).save();
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid password');

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

      return { token, user };
    },

    createProject: async (_, { title, description, userId }) =>
      await new Project({ title, description, userId }).save(),

    createTask: async (_, { title, status, projectId, assignedTo, deadline }) => {
      const task = new Task({
        title,
        status,
        projectId,
        assignedTo,
        deadline: deadline ? new Date(deadline) : null
      });

      const saved = await task.save();

      // ✅ Schedule notification 1 hour before deadline
      if (task.deadline) {
        const now = new Date();
        const notifyTime = new Date(task.deadline.getTime() - 60 * 60 * 1000); // 1 hour before
        const delay = notifyTime.getTime() - now.getTime();

        if (delay > 0) {
          setTimeout(() => {
            console.log(`📢 Reminder: Task "${task.title}" is due in 1 hour!`);
          }, delay);
        }
      }

      return saved;
    },

    updateTaskStatus: async (_, { id, status }) => {
      const updated = await Task.findByIdAndUpdate(id, { status }, { new: true }).populate('assignedTo');

      // ✅ Notify admin if task is marked done
      if (status === 'Done') {
        const task = await Task.findById(id).populate('assignedTo');
        const admins = await User.find({ role: 'admin' });
        admins.forEach(admin => {
          console.log(`📨 Notification to Admin ${admin.username}: Task "${task.title}" is marked Done by ${task.assignedTo?.username}`);
        });
      }

      return updated;
    },

    deleteTask: async (_, { id }) => await Task.findByIdAndDelete(id)
  },

  Project: {
    user: async (parent) => await User.findById(parent.userId)
  },

  Task: {
    project: async (parent) => await Project.findById(parent.projectId),
    assignedTo: async (parent) => await User.findById(parent.assignedTo)
  }
};

module.exports = resolvers;
