import { gql } from "apollo-server-express";
const typeDefs = gql`
  type Query {
    users: [User]
    ievent(by: ID!): [Events]
  }

  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type TypeGuest {
    email: String
    id: String
  }

  type TypeDuration {
    hours: Int
    minutes: Int
  }

  type Events {
    eventName: String
    addGuest: [TypeGuest]
    date: String
    description: String
    duration: TypeDuration
    location: String
    meetingRoom: String
    notification: String
    reminder: Int
    time: String
    imageUrls: [String]
    by: ID!
  }

  type UserData {
    token: String!
    user: User!
  }

  type Mutation {
    signupUser(userNew: UserInput!): User
    signinUser(userSignin: UserSigninInput!): UserData
    createEvent(event: Event!): String
  }

  input Duration {
    hours: Int
    minutes: Int
  }

  input Guest {
    email: String
    id: String
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  input UserSigninInput {
    email: String!
    password: String!
  }
  input Event {
    addGuest: [Guest]
    date: String
    description: String
    duration: Duration
    eventName: String
    location: String
    meetingRoom: String
    notification: String
    reminder: Int
    time: String
    imageUrls: [String]
  }
`;
export default typeDefs;
