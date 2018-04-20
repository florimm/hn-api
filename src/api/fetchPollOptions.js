import fetch from './fetch';
import orderBy from 'lodash/orderBy';

function fetchPollOption(id) {
  console.log(`Fetching Poll option ${id}`);

  return fetch(`item/${id}`)
    .then(pollOpt => {
      if (pollOpt.deleted) return null;

      return ({
        text: pollOpt.text,
        voteCount: pollOpt.score,
      });
    })
}


/**
 * Fetch a list of poll options
 *
 * @param {Number} idList – array of entry IDs
 * @return {Promise} – A promise resolving to array of poll option objects
 *
 * */

function fetchPollOptions(idList) {
  return Promise.all(idList.map(fetchPollOption))
    .then(options =>
      orderBy(options, 'voteCount', 'desc')
        .filter(option => {
          return option !== null && option !== undefined;
        })
    )
    .catch(error => console.log(`Failed fetching poll options ${idList}: ${error}`));
}

export default fetchPollOptions;
