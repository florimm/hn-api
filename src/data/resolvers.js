import { fetchFeed, fetchPost, fetchUser, fetchComment, fetchComments, fetchPollOptions, fetchFeedIDs } from '../api/';

const resolvers = {
  Query: {
    feed(_, args) {
      return {
        // Pass the total amount of posts in each feed, so the client can build a pagination
        postCount: fetchFeedIDs(args.feedName).then(ids => ids.length),
        posts: fetchFeed(args.feedName, args.page, args.limit)
      }
    },

    post(_, args) {
      return fetchPost(args.id);
    },

    comment(_, args) {
      return fetchComment(args.id, true);
    },

    comments(_, args) {
      return fetchComments(args.commentIDs, args.skip, args.limit);
      //console.log(args.commentIDs);
      //const maxComments = 10;
    },

    user(_, args) {
      return fetchUser(args.id);
    }
  },

  Post: {
    comments(parentPost, args) {
      if (!parentPost.commentIDs) {
        return null;
      }

      return fetchComments(parentPost.commentIDs, args.skip, args.limit);
    },

    async poll(parentPost) {
      if (!parentPost.pollOptionIDs || !parentPost.pollOptionIDs.length > 0) {
        return null;
      }

      const options = await fetchPollOptions(parentPost.pollOptionIDs);
      const totalVotes = options.reduce((acc, item) => acc + item.voteCount, 0);

      // Construct an object according to Poll Object in schema, by adding total
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
    comments(parentComment, args) {
      if (!parentComment.commentIDs) {
        return null;
      }

      return fetchComments(parentComment.commentIDs, args.skip, args.limit);
    }
  },
};

export default resolvers;

