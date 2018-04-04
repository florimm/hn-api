import API from './api';
import cache from './cache';

/**
 *
 * Fetch anything from Firebase by path: 'item/132', `topstories`, `user/pg`, etc.
 *
 * @param {String} path
 * @return Promise
 *
 * */
function fetch(path) {
  if (cache && cache.has(path)) {
    console.log(`Fetching ${path} from cache`);
    return Promise.resolve(cache.get(path));
  }
  
  return API.child(path)
    .once('value')
    .then(snapshot => {
      if (cache) {
        cache.set(path, snapshot.val());
      }
  
      console.log(`Fetched ${path}`);
      return snapshot.val();
    })
    .catch(error => console.log(`Failed fetching ${path}: ${error}`));
}

export default fetch;

