import { ApolloClient, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    uri: process.env.GRAPHQL_URL,
      headers: {
        Authorization: process.env.GRAPHQL_TOKEN || ''
      },
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;