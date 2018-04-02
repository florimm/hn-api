import { fetchPost, fetchFeed } from '../api/';

const resolvers = {
  Query: {
    post(obj, args, context) {
      return fetchPost(args.id);
    },
    
    feed(obj, args, context) {
      return fetchFeed(args.name, args.page, args.limit)
    }
  },
  
  Post: {},
  
  Comment: {}
  Comment: {
    comments(parentComment) {
      return parentComment.commentIDs && fetchComments(parentComment.commentIDs);
    }
  },
};

export default resolvers;

