import lru from 'lru-cache';
import API from './api';
import { FEED_NAMES } from '../constants';

const cache = lru({
  max: 1000,
  maxAge: 1000 * 60 * 15
});

export default cache;

export const cachedFeedIDs = {};

// Keep feed IDs in memory
Object.keys(FEED_NAMES).forEach(feed => {
  API.child(FEED_NAMES[feed])
    .on('value',
      snapshot => {
        cachedFeedIDs[feed] = snapshot.val();
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
        console.log(`Item with id ${id} updated, removing from cache`);
        // TODO: Refetch?
        cache.del(`item/${id}`);
      }
    });
  });

// TODO: Need to invalidate users same way.
