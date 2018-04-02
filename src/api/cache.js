import lru from 'lru-cache';
import API from './api';
import { FEED_NAMES } from '../constants';



export default lru({
  max: 1000,
  maxAge: 1000 * 60 * 15
});

export const cachedFeedIDs = {};

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

