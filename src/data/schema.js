import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import mocks from './mocks';
import resolvers from './resolvers';

// language=GraphQL Schema
const typeDefs = `
  type Query {
    # Feed of posts of given type (top, new, etc.). Limited to 30 posts per page by default.
    feed(
      # Name of the feed (top, new, show, ask, jobs, or best)
      feedName: String!,
      
      # Current page of the feed to display
      page: Int = 1,
      
      # Amount of posts per page
      limit: Int = 30
    ): Feed!
    
    # Fetch a post by ID
    post(id: ID!): Post
    
    # Fetch a comment by ID
    comment(id: ID!): Comment
    
    # Fetch multiple comments by IDs
    comments(commentIDs: [ID!], skip: Int = 0, limit: Int): [Comment]!
    
    # Fetch a user by username
    user(username: String!): User
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
    commentIDs: [ID]
    comments(skip: Int = 0, limit: Int): [Comment]
  }

  type Comment {
    id: ID!
    type: String
    text: String
    time: Int!
    author: String
    commentIDs: [ID]
    comments(skip: Int = 0, limit: Int): [Comment]
    parent: ID
    parentPostID: ID
    parentPostTitle: String
    deleted: Boolean
  }
  
  type User {
    username: String!
    createdAt: Int!
    karma: Int
    about: String
    submissions: [ID] 
  }
  
  type Poll {
    totalVotes: Int!
    options: [PollOption]! 
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
