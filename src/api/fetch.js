import API from './api';
import cache from './cache';
import logger from '../logger';

const log = logger('app:fetch');

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
    log.debug(`Fetching ${path} from cache`);
    return Promise.resolve(cache.get(path));
  }

  return API.child(path)
    .once('value')
    .then(snapshot => {
      log.debug(`Fetching ${path} from Firebase`);

      if (cache) {
        cache.set(path, snapshot.val());
      }

      return snapshot.val();
    })
    .catch(error => log.error(`Failed fetching ${path}: ${error}`));
}

export default fetch;

