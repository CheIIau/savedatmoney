import { ApolloClient /*, createHttpLink */ } from '@apollo/client/core';
import { ApolloClients } from '@vue/apollo-composable';
import { boot } from 'quasar/wrappers';
import { getClientOptions } from 'src/apollo';

export default boot(({ app }) => {
  const options = getClientOptions();
  const apolloClient = new ApolloClient(options);
  const apolloClients: Record<string, ApolloClient<unknown>> = {
    default: apolloClient,
  };

  app.provide(ApolloClients, apolloClients);
});
