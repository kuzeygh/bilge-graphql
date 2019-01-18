const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const express = require("express");

const resolvers = {
  Query,
  Mutation
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint: "https://eu1.prisma.sh/soylemezali42-498aa2/bilge-example/dev",
      secret: "22105417aL!",
      debug: true
    })
  })
});

server.express.use("/images", express.static("images"));

server.start(() =>
  console.log(`The server is running on https://localhost:4000`)
);
