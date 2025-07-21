require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
          return { user: decoded };
        } catch {
          return {};
        }
      }
      return {};
    },
  });

  await server.start();

  app.use(cors());
  app.use(express.json());
  server.applyMiddleware({ app });

  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('✅ MongoDB connected');
      app.listen(PORT, () =>
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
      );
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));
};

startServer();
