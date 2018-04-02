import fetch from './fetch';

/**
 * Fetch a single post
 *
 * @param {String} id – ID of the post
 * @return {Promise<Object>} – Single entry object
 *
 *  */

export function fetchPost(id) {
  console.log(`Fetching post ${id}`);
  
  return fetch(`item/${id}`)
    .then(post => ({
      id: post.id,
      type: post.type,
      title: post.title || null,
      url: post.url || null,
      text: post.text || null,
      score: post.score || null,
      time: post.time,
      authorID: post.author,
      pollOptionIDs: post.pollOptions || null,
      commentCount: post.descendants || null,
      commentIDs: post.kids || null,
    }))
}

export default fetchPost;
