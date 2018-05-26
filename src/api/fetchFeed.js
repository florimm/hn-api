import fetch from './fetch';
import { ENTRIES_PER_PAGE } from '../constants';
import fetchPosts from './fetchPosts';
import fetchFeedIDs from './fetchFeedIDs';
import logger from '../logger';

const log = logger('app:fetchFeed');

/**
 * Fetch a feed of given name and page: top 1st page, news 2nd page, etc.
 *
 * @param {String} name – Name of the feed
 * @param {Number} page – Current page on the website, e.g. /top/2
 * @param {Number} limit - Number of entries shown per page
 * @return {Promise<Array>} – A promise resolving to array of posts
 *
 *  */

function fetchFeed(name, page = 1, limit = ENTRIES_PER_PAGE) {
  log.info(`Fetching feed ${name}`);

  const skip = (page - 1) * limit;

  return fetchFeedIDs(name)
    .then(idList => idList.slice(skip, skip + limit))
    .then(fetchPosts)
    .then(posts => Promise.all(posts))
    .catch(error => log.error(`Failed fetching feed ${name}: ${error}`));
}

export default fetchFeed;
