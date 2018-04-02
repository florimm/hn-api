import fetch from './fetch';

/**
 * Fetch a single comment
 *
 * @param {String} id – ID of the comment
 * @return {Promise<Object>} – Single comment object
 *
 *  */

export function fetchComment(id) {
  console.log(`Fetching comment ${id}`);
  
  return fetch(`item/${id}`)
    .then(comment => ({
      id:     comment.id,
      type:   comment.type,
      text:   comment.text || null,
      time:   comment.time,
      author: comment.by,
      commentCount: comment.descendants || null,
      commentIDs: comment.kids || null,
    }));
}

export default fetchComment;
