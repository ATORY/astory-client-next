
import {
  ApolloClient,
  createNetworkInterface,
  toIdValue,
} from 'react-apollo';

import fetch from 'isomorphic-fetch';

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

const configProd = {
  uri: 'https://atory.cc/api/graphql', // Server URL (must be absolute)
  opts: {
    credentials: 'same-origin',
  },
};

const configDev = {
  uri: 'http://localhost:4000/graphql',
  opts: {
    credentials: 'include',
  },
};

const config = process.env.NODE_ENV === 'production' ? configProd : configDev;

const networkInterface = createNetworkInterface(config);

// networkInterface.use([{
//   applyMiddleware(req, next) {
//     setTimeout(next, 500);
//   },
// }]);

function create(initialState) {
  const client = new ApolloClient({
    initialState,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    networkInterface,
    customResolvers: {
      Query: {
        article: (_, { _id }) => {
          const article = toIdValue(client.dataIdFromObject({
            __typename: 'Article',
            _id,
          }));
          return article;
        },
      },
    },
  });
  return client;
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
