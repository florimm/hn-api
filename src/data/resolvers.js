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
    
    async poll(parentPost) {
      if (!parentPost.pollOptionIDs || !parentPost.pollOptionIDs.length > 0) {
        return null;
      }
      
      const options = await fetchPollOptions(parentPost.pollOptionIDs);
      const totalVotes = options.reduce((acc, item) => acc + item.voteCount, 0);
  
      // Construct an object according to Poll Object in schema, by addint total
      // votes, and injecting percentage into every option item.
      return {
        totalVotes,
        options: options.map(option => ({
          ...option,
          percentage: Math.round((option.voteCount / totalVotes) * 10000) / 100,
        }))
      }
    }
  },
  
  Comment: {
    comments(parentComment) {
      return parentComment.commentIDs && fetchComments(parentComment.commentIDs);
    }
  },
};

export default resolvers;

