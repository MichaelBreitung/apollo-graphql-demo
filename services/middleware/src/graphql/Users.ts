import { gql } from "graphql-tag";
import { TNewUserData, TUserData } from "../data";
import { TContext } from "./types";

const USER_CREATED_EVENT: string = "USER_CREATED";

// Note that TUser is currently different to TUserData. It
// is why we have to define a separate type here
type TUser = TNewUserData & {
  id: number;
  friends?: Array<number>;
};

function userFromUserData(userData: TUserData): TUser {
  return { ...userData, friends: userData.friends?.split(", ").map(Number) };
}

export const usersTypeDefs = gql`
  input NewUserData {
    name: String!
    surname: String!
    nick: String @deprecated(reason: "Not required anymore")
    age: Int
  }

  type User {
    id: Int!
    name: String!
    surname: String!
    nick: String @deprecated(reason: "Not required anymore")
    age: Int
    friends: [User!]
  }

  type MoreUsers {
    total: Int!
    maxPageSize: Int!
  }

  union Users = User | MoreUsers

  extend type Query {
    users: [User!]!
    user(id: Int!): User
  }

  extend type Mutation {
    addUser(user: NewUserData!): User!
    makeFriends(id1: Int!, id2: Int!): Boolean!
    deleteUser(id: Int!): Boolean!
  }

  extend type Subscription {
    userCreated: User!
  }
`;

export const usersResolvers = {
  Users: {
    __resolveType(obj: any, _context: TContext, _info: any) {
      if (obj.id != undefined) {
        return "User";
      } else {
        return "MoreUsers";
      }
    },
  },
  Query: {
    users: async (_parent: any, _args: any, context: TContext, _info: any) => {
      const usersData = await context.users.getUsers();
      return usersData.map((userData) => userFromUserData(userData));
    },
    user: async (_parent: any, args: any, context: TContext, _info: any) => {
      const userData = await context.users.getUser(args.id);
      return userData ? userFromUserData(userData) : null;
    },
  },
  User: {
    friends: async (parent: any, _args: any, context: TContext, _info: any) => {
      let friends: Array<TUser> | null = null;
      const userWithFriends = await context.users.getUser(parent.id);
      if (userWithFriends?.friends) {
        friends = new Array();
        const friendIds = userWithFriends.friends.split(", ").map(Number);
        for (let i = 0; i < friendIds.length; i++) {
          const friend = await context.users.getUser(friendIds[i]);
          if (friend) {
            friends!.push(userFromUserData(friend));
          }
        }
      }
      return friends;
    },
  },
  Mutation: {
    addUser: async (_parent: any, args: any, context: TContext, _info: any) => {
      const newUserData = await context.users.addUser(
        args.user as TNewUserData
      );
      const newUser = { ...newUserData };
      if (context.pubsub) {
        context.pubsub.publish(USER_CREATED_EVENT, {
          userCreated: newUser,
        });
      }
      return newUser;
    },
    makeFriends: (_parent: any, args: any, context: TContext, _info: any) =>
      context.users.makeFriends(args.id1, args.id2),
    deleteUser: (_parent: any, args: any, context: TContext, _info: any) =>
      context.users.deleteUser(args.id),
  },
  Subscription: {
    userCreated: {
      subscribe: (_parent: any, _args: any, context: TContext) => {
        if (context.pubsub) {
          return context.pubsub.asyncIterator([USER_CREATED_EVENT]);
        } else {
          throw new Error("No PupSub available");
        }
      },
    },
  },
};
