import casual from 'casual';

const mocks = {
  Post: () => ({
    type: casual.random_element(['story', 'job', 'poll']),
    title: casual.title,
    url: casual.url,
    text: casual.description,
    score: casual.integer(1, 1000),
    time: casual.unix_time,
    commentCount: casual.integer(1, 1000),
  }),
  
  User: () => ({
    id: casual.username,
    createdAt: casual.unix_time,
    karma: casual.integer(1, 1000),
    about: casual.description,
  })
};

export default mocks;
