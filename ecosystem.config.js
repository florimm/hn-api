module.exports = {
  apps : [
    {
      name      : 'HNAPI',
      script    : 'start.prod.js',
      env: {
        NODE_ENV: 'production'
      }
    },
  ],
};
