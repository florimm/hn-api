import fetch from './fetch';
import API from './api';

/**
 * Fetch a single comment
 *
 * @param {String} id – ID of the comment
 * @param {Boolean} withParentPostID – When true, will fetch the id and title of the parent Post
 * @return {Promise<Object>} – Single comment object
 *
 *  */

export async function fetchComment(id, withParentPostID = false) {
  const comment = await fetch(`item/${id}`);
  
  if (!comment || (comment && comment.dead)) {
    return null;
  }
  
  return {
    id: comment.id,
    type: comment.type,
    text: comment.text || null,
    time: comment.time,
    author: comment.by || null,
    commentCount: comment.descendants || null,
    commentIDs: comment.kids || null,
    deleted: comment.deleted || false,
    parentPostID: withParentPostID ? await getParentPostId(comment.parent) : null,
  }
}

// Recursively fetch the post id for any comment.
// The API unfortunately doesn't provide this (only immediate parent ID),
// but we need id to display Post info on /comment pages.
function getParentPostId(id) {
  return fetch(`item/${id}/parent`)
    .then(result => {
      if (result) {
        return getParentPostId(result)
      }

      return id;
    })
}

export default fetchComment;
