import fetch from './fetch';
import fetchPost from './fetchPost'
import logger from '../logger';

const log = logger('app:fetchPosts');


/**
 * Fetch a list of posts
 *
 * @param {Number} idList – array of entry IDs
 * @return {Promise} – A promise resolving to array of entries
 *
 *  */

function fetchPosts(idList) {
  //console.log(`Fetching ${idList}`);

  return Promise.all(idList.map(fetchPost))
    .then(posts => posts.filter(post => post !== null && post !== undefined))
    .catch(error => log.error(`Failed fetching ${idList}: ${error}`));
}

export default fetchPosts;

// TODO: fetchPosts, fetchComments, fetchPolloptions are doing the same. Refactor?
