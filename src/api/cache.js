import lru from 'lru-cache';
import API from './api';
import fetch from './fetch';
import { FEED_NAMES } from '../constants';

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
// TODO: Caching strategy
