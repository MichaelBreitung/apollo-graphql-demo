import { describe, it, expect } from "@jest/globals";
import { ApolloServer } from "@apollo/server";

import { createUsers, TUserData } from "../src/data";
import { getSchema } from "../src/graphql";
import assert from "assert";

const testUsers = [
  {
    name: "Michael",
    surname: "B",
    nick: "mibreit",
    age: 43,
  },
  {
    name: "John",
    surname: "Doe",
    nick: "JD",
    age: 66,
  },
  {
    name: "Albert",
    surname: "E",
    nick: "A",
    age: 55,
  },
];

describe("User Management Integration Test Suite", () => {
  const schema = getSchema();
  const server = new ApolloServer({
    schema,
  });
  it("getUsers works", async () => {
    const users = await createUsers(testUsers);
    const result = await server.executeOperation(
      {
        query: `query {users {id, name, surname, nick, age}}`,
      },
      {
        contextValue: {
          users,
        },
      }
    );

    assert(result.body.kind === "single");
    const usersList = result.body.singleResult.data?.users as Array<TUserData>;

    expect(usersList.length).toBe(3);
    expect(usersList[0]).toEqual({ ...testUsers[0], id: 0 });
    expect(usersList[1]).toEqual({ ...testUsers[1], id: 1 });
    expect(usersList[2]).toEqual({ ...testUsers[2], id: 2 });
  });

  it("makeFriends works", async () => {
    const users = await createUsers(testUsers);
    let result = await server.executeOperation(
      {
        query: `mutation {
          makeFriends1: makeFriends(id1: 0, id2: 1) 
          makeFriends2: makeFriends(id1: 0, id2: 2)
        }`,
      },
      {
        contextValue: {
          users,
        },
      }
    );

    assert(result.body.kind === "single");
    const makeFriendsResult = result.body.singleResult.data?.makeFriends1;
    const makeFriends2Result = result.body.singleResult.data?.makeFriends2;
    const usersList = await users.getUsers();

    expect(makeFriendsResult).toBeTruthy();
    expect(makeFriends2Result).toBeTruthy();
    expect(usersList[0].friends).toBe("1, 2");
    expect(usersList[1].friends).toBe("0");
    expect(usersList[2].friends).toBe("0");
  });

  // TODO: More test cases
});
