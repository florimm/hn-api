import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

// language=GraphQL Schema
const typeDefs = `
  type Query {
    test: String
  }
`;

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
