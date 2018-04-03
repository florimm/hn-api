import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import mocks from './mocks';
import resolvers from './resolvers';

// TODO: Document the schema

// language=GraphQL Schema
const typeDefs = `
  type Query {
    # Single feed of posts of given type (top, new, etc.). Limited to 30 posts per page by default.
    feed(
      # Name of the feed (top, new, show, ask, etc.)
      feedName: String!,
      
      # Current page of the feed to display
      page: Int = 1,
      
      # Amount of posts per page
      limit: Int = 30
    ): Feed!
    
    # Single post
    post(id: ID!): Post
    
    # Single comment
    comment(id: ID!): Comment
    
    # Single user
    user(id: String!): User
  }
  
  type Feed {
    postCount: Int!
    posts: [Post]!
  }
  
  type Post {
    id: ID!
    type: String!
    title: String!
    url: String
    text: String
    score: Int
    time: Int!
    author: String!
    poll: Poll
    commentCount: Int
    comments: [Comment]
  }

  type Comment {
    id: ID!
    type: String
    text: String
    time: Int!
    author: String
    comments: [Comment]
    deleted: Boolean
  }
  
  type User {
    username: String
    createdAt: Int!
    karma: Int
    about: String
    #submissions: [?]
  }
  
  type Poll {
    totalVotes: Int!
    options: [PollOption] #!
  }
  
  type PollOption {
    text: String!
    voteCount: Int!
    percentage: Float!
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

//addMockFunctionsToSchema({ schema, mocks });

export default schema;
