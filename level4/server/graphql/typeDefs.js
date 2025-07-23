const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type Project {
    id: ID!
    title: String!
    description: String!
    user: User
  }

  type Task {
    id: ID!
    title: String!
    status: String!
    project: Project
    assignedTo: User
    deadline: String
  }

  type Notification {
    id: ID!
    message: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    hello: String
    getUsers: [User]
    getProjects: [Project]
    getTasks: [Task]
    getNotifications: [Notification]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!, role: String!): User
    login(email: String!, password: String!): AuthPayload
    createProject(title: String!, description: String!, userId: ID!): Project
    deleteProject(id: ID!): Project
    createTask(title: String!, status: String!, projectId: ID!, assignedTo: ID!, deadline: String): Task
    deleteTask(id: ID!): Task
    updateTaskStatus(id: ID!, status: String!): Task
  }
`;

module.exports = typeDefs;
