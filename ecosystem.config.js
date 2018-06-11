module.exports = {
  apps : [
    {
      name      : 'HNAPI',
      script    : 'build/graphql.server.js',
      env: {
        NODE_ENV: 'production'
      }
    },
  ],
};
