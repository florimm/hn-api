import { fetchFeed, fetchPost, fetchUser, fetchComment, fetchComments, fetchPollOptions } from '../api/';

const resolvers = {
  Query: {
    feed(_, args) {
      return fetchFeed(args.name, args.page, args.limit)
    },
    
    post(_, args) {
      return fetchPost(args.id);
    },
    
    comment(_, args) {
      return fetchComment(args.id);
    },
    
    user(_, args) {
      return fetchUser(args.id);
    }
  },
  
  Post: {
    comments(parentPost) {
      return fetchComments(parentPost.commentIDs);
    },
  
  Comment: {
    comments(parentComment) {
      return parentComment.commentIDs && fetchComments(parentComment.commentIDs);
    }
  },
};

export default resolvers;

