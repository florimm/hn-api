import fetch from './fetch';
import logger from '../logger';

const log = logger('app:fetchUser');

/**
 * Fetch a single user
 *
 * @param {String} id – ID of the user
 * @return {Promise<Object>} – Single user object
 *
 *  */

export function fetchUser(id) {
  log.info(`Fetching user ${id}`);

  return fetch(`user/${id}`)
    .then(user => {
      if (user === null) {
        return null;
      }

      return ({
        username: user.id,
        about: user.about || null,
        createdAt: user.created,
        delay: user.delay || null,
        karma: user.karma || null,
        submissions: user.submitted || null,
      });
    })
    .catch(error => log.error(`Failed fetching user ${id}`))
}

export default fetchUser;
