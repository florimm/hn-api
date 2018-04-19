import fetch from './fetch';

/**
 * Fetch a single user
 *
 * @param {String} id – ID of the user
 * @return {Promise<Object>} – Single user object
 *
 *  */

export function fetchUser(id) {
  console.log(`Fetching user ${id}`);

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
    });
}

export default fetchUser;
