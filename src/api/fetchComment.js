import fetch from './fetch';
import API from './api';
import logger from '../logger';

const log = logger('app:fetchComment');

/**
 * Fetch a single comment
 *
 * @param {String} id – ID of the comment
 * @param {Boolean} withPostInfo – When true, will fetch the id and title of the parent Post
 * @return {Promise<Object>} – Single comment object
 *
 *  */

export async function fetchComment(id, withPostInfo = false) {
  const comment = await fetch(`item/${id}`);

  if (!comment || (comment && comment.dead)) {
    return null;
  }

  const postInfo = withPostInfo ? await getParentPostId(comment) : null;

  return {
    id: comment.id,
    type: comment.type,
    text: comment.text || null,
    time: comment.time,
    author: comment.by || null,
    commentCount: comment.descendants || null,
    commentIDs: comment.kids || null,
    parent: comment.parent || null,
    parentPostID: postInfo && postInfo.postID,
    parentPostTitle: postInfo && postInfo.postTitle,
    deleted: comment.deleted || false,
  }
}

// Recursively fetch the parent post id and title for any comment.
// The API unfortunately doesn't provide this (only immediate parent ID),
// but we need id to display Post info on /comment/ pages.
//
// The whole approach is embarassing, but there doesn't seem to be any other sane way to do this.

function getParentPostId(comment) {
  log.info('Retrieving parent post info for ', comment.id);

  return fetch(`item/${comment.parent}`)
    .then(result => {
      if (result && result.type !== 'comment') {
        log.info('parent Post ID: ', result.id);

        return {
          postTitle: result.title,
          postID: result.id,
        }
      }

      return getParentPostId(result);
    });
}

export default fetchComment;
