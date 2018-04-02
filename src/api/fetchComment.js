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
    .then(comment => {
      // Filter out dead comments or rare ones that come without text
      if (comment.dead) {
        return null;
      }
      
      return ({
        id: comment.id,
        type: comment.type,
        text: comment.text || null,
        time: comment.time,
        author: comment.by || null,
        commentCount: comment.descendants || null,
        commentIDs: comment.kids || null,
        deleted: comment.deleted || false
      });
    });
}

export default fetchComment;
