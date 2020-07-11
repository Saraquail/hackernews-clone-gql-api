const { GraphQLServer, PubSub } = require("graphql-yoga");
const { PrismaClient } = require("@prisma/client");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require('./resolvers/Subscription')
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Vote = require('./resolvers/Vote')

const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

// This tells the server what API operations are accepted and how they should be resolved.
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: (request) => {
    return {
      ...request,
      prisma,
      pubsub
    };
  },
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
