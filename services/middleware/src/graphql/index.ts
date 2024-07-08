import { gql } from "graphql-tag";
import { PubSub } from "graphql-subscriptions";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge } from "lodash";

import { IUsers } from "../data";

import { usersTypeDefs, usersResolvers } from "./Users";
import { TContext } from "./types";

const baseTypeDefs = gql`
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
  type Subscription {
    _: String
  }
`;

/**
 * @returns the executable schema for all combined typeDefs and resolvers
 */
export function getSchema() {
  const typeDefs = [baseTypeDefs, usersTypeDefs];

  const resolvers = merge([{}, usersResolvers]);

  return makeExecutableSchema({ typeDefs, resolvers });
}

export function getContext(
  users: IUsers,
  subscriptionSupport: boolean = true
): TContext {
  let pubsub;
  if (subscriptionSupport) {
    pubsub = new PubSub();
  }

  return {
    users,
    pubsub,
  };
}
