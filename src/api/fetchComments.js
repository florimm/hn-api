import fetch from './fetch';
import fetchComment from './fetchComment';
import logger from '../logger';

const log = logger('app:fetchComments');

/**
 * Fetch a list of comments
 *
 * @param {Array} idList – array of comment IDs
 * @param {Number} skip – Skip given number of comments from the start
 * @param {Number} limit – Limit the amount of comments to fetch
 * @return {Promise} – A promise resolving to array of comment objects
 *
 *  */

export function fetchComments(idList, skip, limit) {
  //console.log(`Fetching comment ${idList}`);

  const from = skip;
  const upto = (limit === undefined)
    ? undefined
    : from + limit;
  const filteredIDList = idList.slice(from, upto);

  return Promise.all(
    filteredIDList.map(id => fetchComment(id, false))
  )
    .then(comments =>
      comments.filter(comment =>
        comment !== null && comment !== undefined)
    )
    .catch(error => log.error(`Failed fetching ${idList}: ${error}`));
}

export default fetchComments;
