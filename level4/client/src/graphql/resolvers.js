const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    getUsers: async () => await User.find(),
    
    getProjects: async (_, __, context) => {
      if (!context.user) throw new Error('Unauthorized');

      if (context.user.role === 'admin') {
        return await Project.find().populate('userId');
      }

      const tasks = await Task.find({ assignedTo: context.user._id });
      const projectIds = [...new Set(tasks.map(t => t.projectId.toString()))];
      return await Project.find({ _id: { $in: projectIds } }).populate('userId');
    },

    getTasks: async (_, __, context) => {
      if (!context.user) throw new Error('Unauthorized');

      if (context.user.role === 'admin') {
        return await Task.find().populate('projectId assignedTo');
      }

      return await Task.find({ assignedTo: context.user._id }).populate('projectId assignedTo');
    },

    getNotifications: async (_, __, context) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Only admins can view notifications');
      }
      return await Notification.find().sort({ createdAt: -1 });
    }
  },

  Mutation: {
    register: async (_, { username, email, password, role }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('Email already registered');

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword, role });
      return await newUser.save();
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new Error('Invalid password');

      const token = jwt.sign(
        { _id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { token, user };
    },

    createProject: async (_, { title, description, userId }, context) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Only admins can create projects');
      }

      const newProject = new Project({ title, description, userId });
      return await newProject.save();
    },

    deleteProject: async (_, { id }, context) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Only admins can delete projects');
      }

      return await Project.findByIdAndDelete(id);
    },

    createTask: async (_, { title, status, projectId, assignedTo, deadline }, context) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Only admins can create tasks');
      }

      const user = await User.findById(assignedTo);
      if (!user) throw new Error('Assigned user not found');

      const newTask = new Task({ title, status, projectId, assignedTo, deadline });
      return await newTask.save();
    },

    deleteTask: async (_, { id }, context) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Only admins can delete tasks');
      }

      return await Task.findByIdAndDelete(id);
    },

    updateTaskStatus: async (_, { id, status }, context) => {
      if (!context.user) throw new Error('Unauthorized');

      const task = await Task.findById(id).populate('assignedTo');
      if (!task) throw new Error('Task not found');

      const isAdmin = context.user.role === 'admin';
      const isAssignedUser = String(task.assignedTo._id) === String(context.user._id);

      if (!isAdmin && !isAssignedUser) {
        throw new Error('Only the assigned user or admin can update the task');
      }

      task.status = status;
      const updatedTask = await task.save();

      if (status === 'Done') {
        const message = `Task "${task.title}" was marked as Done by ${task.assignedTo?.username || 'a user'}`;
        await new Notification({ message }).save();
      }

      return updatedTask;
    }
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
