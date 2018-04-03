import { fetchFeed, fetchPost, fetchUser, fetchComment, fetchComments, fetchPollOptions, fetchFeedIDs } from '../api/';

const resolvers = {
  Query: {
    feed(_, args) {
      return {
        // Pass total amount of posts in each feed, so client can build pagination
        postCount: fetchFeedIDs(args.feedName).then(ids => ids.length),
        posts: fetchFeed(args.feedName, args.page, args.limit)
      }
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
    
    poll(parentPost) {
      if (!parentPost.pollOptionIDs || !parentPost.pollOptionIDs.length > 0) {
        return null;
      }
      
      return fetchPollOptions(parentPost.pollOptionIDs)
      
        // Construct the Poll object by supplying calculated total votes and an array of options
        .then(options => ({
          totalVotes: options.reduce((acc, item) => {
            return acc + item.voteCount;
          }, 0),
          options
        }));
    }
  },
  
  Comment: {
    comments(parentComment) {
      return parentComment.commentIDs && fetchComments(parentComment.commentIDs);
    }
  },
};

export default resolvers;

