import { PubSub } from "graphql-subscriptions";
import type { IUsers } from "../data";

export type TContext = {
  users: IUsers;
  pubsub?: PubSub;
};
