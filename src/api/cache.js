import lru from 'lru-cache';
import API from './api';
import fetch from './fetch';
import { FEED_NAMES } from '../constants';
import { request } from 'graphql-request'


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
        console.log(`Updated cached IDs for "${feed}"`);
      },
      error => {
        console.log(error);
      })
});

// Invalidate updated items
API.child("updates/items")
  .on('value', snapshot => {
    snapshot.val().forEach(id => {
      if (cache && cache.has(`item/${id}`)) {

        fetch(`item/${id}`)
          .then(_ => console.log(`Item with id ${id} updated, re-caching.`))
          .catch(error => "Failed re-caching Item with id ${id}");
      }
    });
  });

// TODO: Need to invalidate users same way.


// Fetch & cache first two pages of all posts with comments on run
//
// Since the needed data comes from different resolvers for different GraphQL types and fields,
// it's easier to just run a local GraphQL query and let the magic happen.

// TODO: "Show" feed
// TODO: Tidy up, move into a separate file.
// TODO: Figure out what the endpoint should be on production

const CachingQuery = `{
  topFeed:feed(feedName: "top", limit: 60) {
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
  
  newFeed: feed(feedName: "new", limit: 60) {
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
  
  showFeed: feed(feedName: "show", limit: 60) {
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
    .then(data => console.log("Successfully updated feed cache."))
    .catch(error => console.log(`Failed updating feed cache: ${error}`));
}

warmCache();
const cacheInterval = setInterval(warmCache, 15 * 60 * 1000);
