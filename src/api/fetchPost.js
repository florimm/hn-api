import fetch from './fetch';
import logger from '../logger';

const log = logger('app:fetchPost');

/**
 * Fetch a single post
 *
 * @param {String} id – ID of the post
 * @return {Promise<Object>} – Single entry object
 *
 *  */

export function fetchPost(id) {
  //console.log(`Fetching post ${id}`);

  return fetch(`item/${id}`)
    .then(post => {
      if (post === null) {
        return null;
      }

      return ({
        id: post.id,
        type: post.type,
        title: post.title || null,
        url: post.url || null,
        text: post.text || null,
        score: post.score || null,
        time: post.time,
        author: post.by,
        pollOptionIDs: post.parts || null,
        commentCount: post.descendants || null,
        commentIDs: post.kids || null,
      });
    })
    .catch(error => log.error(`Failed fetching post ${id}`))
}

export default fetchPost;
