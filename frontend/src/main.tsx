import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import {
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  split,
  HttpLink,
} from "@apollo/client";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";

import { graphQLUrl, graphQLWSUrl } from "./constants.ts";

// Create an HTTP link
const httpLink = new HttpLink({
  uri: graphQLUrl,
});

// Create a WebSocket link
const wsLink = new GraphQLWsLink(
  createClient({
    url: graphQLWSUrl,
  })
);

// Split links, so we can send data to each link
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

// Create Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
