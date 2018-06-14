# Hacker News GraphQL

GraphQL wrapper over [Hacker News Firebase API](https://github.com/HackerNews/API), used in [Hacker News Redesigned](https://github.com/tigranpetrossian/hacker-news-redesigned) client.

The project was implemented to provide better performance over the HN Firebase API by adding in-memory LRU cache, and eliminate the need of N+1 requests on the client.

## Stack

* [Apollo Server](https://github.com/apollographql/apollo-server)
* [Express](https://expressjs.com/)
* [lru-cache](https://github.com/isaacs/node-lru-cache)
* [winston logger](https://github.com/winstonjs/winston)

## Running locally

1. Clone the repository: `git clone git@github.com:tigranpetrossian/hn-api.git`
2. Run `yarn install`
3. Start in development mode: `yarn start`
4. The API will be available at [http://localhost:4000/graphql](http://localhost:4000/graphql),
you can also try out available queries with [GraphiQL] at [http://localhost:4000/graphiql](http://localhost:4000/graphiql)

`yarn build` and `yarn start:prod` are also available for bundling the project and running on production.

## API Reference:

Please refer to the docs section of the GraphiQL browser (described above) for exploring the API options.
