import fetch from './fetch';
import fetchComment from './fetchComment';

/**
 * Fetch a list of comments
 *
 * @param {Number} idList – array of comment IDs
 * @return {Promise} – A promise resolving to array of comment objects
 *
 *  */

export function fetchComments(idList) {
  console.log(`Fetching comment ${idList}`);
  
  return Promise.all(idList.map(fetchComment))
    .then(comments =>
      comments.filter(comment =>
        comment !== null || comment !== undefined)
    )
    .catch(error => console.log(`Failed fetching ${idList}: ${error}`));
}

export default fetchComments;
