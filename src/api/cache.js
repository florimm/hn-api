import lru from 'lru-cache';
import API from './api';
import fetch from './fetch';
import { FEED_NAMES } from '../constants';
import { request } from 'graphql-request'
import logger from '../logger';

const log = logger('app:cache');

const cache = lru({
  max: 5000,
  maxAge: 1000 * 60 * 60
});

export default cache;

export const cachedFeedIDs = {};

// Keep feed IDs in memory
Object.keys(FEED_NAMES).forEach(feed => {
  API.child(FEED_NAMES[feed])
    .on('value',
      snapshot => {
        cachedFeedIDs[feed] = snapshot.val();
        log.info(`Updated cached IDs for "${feed}"`);
      },
      error => {
        log.error("Failed caching feed IDs: ", error);
      })
});


// Invalidate and re-fetch updated items
API.child("updates/items")
  .on('value', snapshot => {
    snapshot.val() && snapshot.val().forEach(id => {
      if (cache && cache.has(`item/${id}`)) {

        cache.del(`item/${id}`);

        fetch(`item/${id}`)
          .then(_ => log.debug(`Item with id ${id} updated, re-caching.`))
          .catch(error => log.error("Failed re-caching item with id ${id}: ", error));
      }
    });
  });

// Invalidate and re-fetch updated users
API.child("updates/profiles")
  .on('value', snapshot => {
    snapshot.val() && snapshot.val().forEach(id => {
      if (cache && cache.has(`user/${id}`)) {

        cache.del(`user/${id}`);

        fetch(`user/${id}`)
          .then(_ => log.debug(`User with id ${id} updated, re-caching.`))
          .catch(error => log.error("Failed re-caching user with id ${id}: ", error));
      }
    });
  });

// Fetch & cache first two pages of all posts with comments on run
//
// Since the needed data comes from different resolvers for different GraphQL types and fields,
// it's easier to just run a local GraphQL query and let the magic happen.

// TODO: Tidy up, move into a separate file.

const CachingQuery = `{
  topFeed:feed(feedName: "top", limit: 40) {
    postCount
    posts {
      id
      type
      title
      url
      text
      score
      time
      author
      commentCount
      comments { # 0
        ...CommentFields
        comments { # 1
          ...CommentFields
          comments { # 2
            ...CommentFields
            comments { # 3
              ...CommentFields
              comments { # 4
                ...CommentFields
                comments { # 5
                  ...CommentFields
                  comments { #6
                    ...CommentFields
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  newFeed: feed(feedName: "new", limit: 30) {
    postCount
    posts {
      id
      type
      title
      url
      text
      score
      time
      author
      commentCount
    }
  }
  
  showFeed: feed(feedName: "show", limit: 30) {
    postCount
    posts {
      id
      type
      title
      url
      text
      score
      time
      author
      commentCount
    }
  }
}

fragment CommentFields on Comment {
  id
  text
  time
  author
  deleted
  commentIDs
}`;

function warmCache() {
  request('http://localhost:4000/graphql', CachingQuery)
    .then(data => log.info("Successfully updated feed cache."))
    .catch(error => log.error(`Failed updating feed cache: ${error}`));
}

warmCache();
const cacheInterval = setInterval(warmCache, 15 * 60 * 1000);
