const { GraphQLServer } = require("graphql-yoga");
// const { Prisma } = require("prisma-binding");
const { prisma } = require("../database/generated/prisma-client");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
const Post = require("./resolvers/Post");
const User = require("./resolvers/User");
const Vote = require("./resolvers/Vote");
const express = require("express");

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Post,
  Vote
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: req => ({
    ...req,
    prisma
  })
});

server.express.use("/images", express.static("images"));

server.start(() =>
  console.log(`The server is running on https://localhost:4000`)
);
