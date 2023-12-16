// db imports
import "./db/connection.js";

// auth imports
import jwt from "jsonwebtoken";

// express-server imports
import http from 'http';
import express from 'express';

// utils imports
import path from "path";
import { __dirname } from "./utils/common.js";

// GraphQL Imports
import dotenv from 'dotenv'
import typeDefs from "./schemaGql.js";
import resolvers from "./resolvers.js";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground,ApolloServerPluginDrainHttpServer,ApolloServerPluginLandingPageDisabled } from "apollo-server-core";

const port = process.env.PORT || 4000;
console.log(path.join(__dirname,'..','..','..'),'kjsadflkjdsaflkdsjaflkjdlkf')

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


if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,'..','..','..','event-app-front','build')));
  app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'..','..','..','event-app-front','build','index.html'))
  })
} else {
  app.use(express.static(path.join(__dirname,'..','..','..','event-app-front','build')));
  app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'..','..','..','event-app-front','build','index.html'))
  })
}

httpServer.listen({port },() => {
  console.log(`🚀  Server ready at 4000 ${server.graphqlPath}`);
})

