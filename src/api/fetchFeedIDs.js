import fetch from './fetch';
import API from './api';
import { FEED_NAMES } from '../constants';
import { cachedFeedIDs } from './cache';
import logger from '../logger';

const log = logger('app:fetchFeedIDs');

/**
 * Fetch IDs for the given feed (top, new, show, etc.)
 *
 * @param {String} name – Name of the feed
 * @return {Promise<Array>} – A promise resolving to array of IDs
 *
 *  */

function fetchFeedIDs(name) {
  if (cachedFeedIDs && cachedFeedIDs[name]) {
    return Promise.resolve(cachedFeedIDs[name]);
  }

  return API.child(FEED_NAMES[name])
    .once('value')
    .then(snapshot => snapshot.val())
    .catch(error => log.error(`Failed fetching ${name} directly`));
}

export default fetchFeedIDs;
