import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import mocks from './mocks';
import resolvers from './resolvers';

// TODO: Document the schema

// language=GraphQL Schema
const typeDefs = `
  type Query {
    feed(name: String!, page: Int = 1, limit: Int = 30): [Post]!
    post(id: ID!): Post
    comment(id: ID!): Comment
    user(id: String!): User
  }
  
  type Post {
    id: ID!
    type: String!
    title: String!
    url: String
    text: String
    score: Int
    time: Int!
    author: User!
    pollOptions: [PollOption]
    commentCount: Int
    comments: [Comment]
  }

  type Comment {
    id: ID!
    type: String
    text: String!
    time: Int!
    author: String!
    comments: [Comment]
  }
  
  type User {
    id: String
    createdAt: Int!
    karma: Int
    about: String
    #submissions: [?]
  }
  
  type PollOption {
    id: ID!
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

//addMockFunctionsToSchema({ schema, mocks });

export default schema;
