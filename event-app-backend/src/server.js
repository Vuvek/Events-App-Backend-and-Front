// auth imports
import cors from 'cors';
import jwt from "jsonwebtoken";

import express from 'express'
import http from 'http'

// db imports
import "./db/connection.js";

// GraphQL Imports
import dotenv from 'dotenv'
import typeDefs from "./schemaGql.js";
import resolvers from "./resolvers.js";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground,ApolloServerPluginDrainHttpServer,ApolloServerPluginLandingPageDisabled } from "apollo-server-core";

const port = process.env.PORT || 4000;

const app = express()
const httpServer = http.createServer(app)

if(process.env.NODE_ENV !== "production") {
  dotenv.config()
}

const context = ({ req }) => {
  const { authorization } = req.headers;
  if (authorization) {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
    return { userId };
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  plugins: [
    ApolloServerPluginDrainHttpServer({httpServer}),
    process.env.NODE_ENV !== "production" ? ApolloServerPluginLandingPageGraphQLPlayground()  :ApolloServerPluginLandingPageDisabled() ],
});

await server.start();
server.applyMiddleware({
  app,
  path : '/graphql'
})

app.get('/',(req,res) => {
  res.send('boom!!!')
})

httpServer.listen({port },() => {
  console.log(`🚀  Server ready at 4000 ${server.graphqlPath}`);
})

