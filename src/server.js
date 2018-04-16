import express from 'express';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './data/schema';
//import './api/analysis'

const app = express();

const corsOptions = {
  // Cache OPTIONS request, so it doesn't block the main request on slow connections.
  maxAge: 86400 // TODO: Doesn't seem to work. Check.
};

app.use(cors(corsOptions));

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({ schema })
);

app.use(
  '/graphiql',
  graphiqlExpress({ endpointURL: '/graphql' })
);

app.use(compression());

app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');
});

// TODO: Need authentication

// TODO:  Disable introspection – https://github.com/helfer/graphql-disable-introspection
//        Apollo Client payloads seem to be significantly larger than GraphiQL, GZIP doesn't help.
