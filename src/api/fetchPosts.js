import fetch from './fetch';
/**
 * Fetch a list of posts
 *
 * @param {Number} idList – array of entry IDs
 * @return {Promise} – A promise resolving to array of entries
 *
 *  */

function fetchPosts(idList) {
  console.log(`Fetching ${idList}`);
  
  return Promise.all(idList.map(fetchPost))
    .then(posts =>
      posts.filter(post =>
        post !== null || post !== undefined)
    )
    .catch(error => console.log(`Failed fetching ${idList}: ${error}`));
}

export default fetchPosts;
