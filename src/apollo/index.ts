/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApolloClientOptions } from '@apollo/client/core';
import { createHttpLink, InMemoryCache } from '@apollo/client/core';
import type { BootFileParams } from '@quasar/app';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        categoriesLocal(existing, { args, readField }) {
          const categories = readField('categories');
          return categories;
        },
        categories(_, { args, toReference }) {
          if (args) {
            return toReference({
              __typename: 'Category',
              id: args.id,
            });
          }
        },
      },
    },
  },
});

export /* async */ function getClientOptions(
  /* {app, router, ...} */ options?: Partial<BootFileParams<any>>,
) {
  return <ApolloClientOptions<unknown>>Object.assign(
    // General options.
    <ApolloClientOptions<unknown>>{
      link: createHttpLink({
        uri:
          process.env.GRAPHQL_URI ||
          // Change to your graphql endpoint.
          '/graphql',
      }),
      resolvers: {},
      cache,
    },

    // Specific Quasar mode options.
    process.env.MODE === 'spa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'ssr'
      ? {
          //
        }
      : {},
    process.env.MODE === 'pwa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'bex'
      ? {
          //
        }
      : {},
    process.env.MODE === 'cordova'
      ? {
          //
        }
      : {},
    process.env.MODE === 'capacitor'
      ? {
          //
        }
      : {},
    process.env.MODE === 'electron'
      ? {
          //
        }
      : {},

    // dev/prod options.
    process.env.DEV
      ? {
          //
        }
      : {},
    process.env.PROD
      ? {
          //
        }
      : {},

    // For ssr mode, when on server.
    process.env.MODE === 'ssr' && process.env.SERVER
      ? {
          ssrMode: true,
        }
      : {},
    // For ssr mode, when on client.
    process.env.MODE === 'ssr' && process.env.CLIENT
      ? {
          ssrForceFetchDelay: 100,
        }
      : {},
  );
}
