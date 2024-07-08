import { Pool, PoolClient } from "pg";
import { pg } from "../tools";

import { TNewUserData, TUserData, UsersModel } from "./UsersModel";
import IUsers from "./UsersInterface";

const USERS_TABLE_NAME = "users";

export default class Users implements IUsers {
  private _clientPool: Pool;

  constructor(clientPool: Pool) {
    this._clientPool = clientPool;
  }

  public async init(initialUsers?: Array<TNewUserData>) {
    console.log("Users#init");
    let poolClient;
    try {
      poolClient = await this._clientPool.connect();
      const tableExists = await pg.doesTableExist(poolClient, "users");
      if (!tableExists) {
        console.log("Users#init -> creating users table");
        await pg.createTable(
          poolClient,
          "users",
          UsersModel.columns,
          UsersModel.constraints
        );
      }

      if (initialUsers) {
        for (let i = 0; i < initialUsers.length; ++i) {
          const exists = await pg.findRowInTable(
            poolClient,
            USERS_TABLE_NAME,
            Object.keys(initialUsers[i]),
            Object.values(initialUsers[i])
          );
          if (!exists) {
            await pg.insertRowIntoTable(
              poolClient,
              USERS_TABLE_NAME,
              Object.keys(initialUsers[i]),
              Object.values(initialUsers[i])
            );
          }
        }
      }
    } catch (error) {
      throw new Error(`Users#init -> ${error}`);
    } finally {
      poolClient?.release();
    }
  }

  public async getUsers(): Promise<Array<TUserData>> {
    let poolClient;
    try {
      poolClient = await this._clientPool.connect();
      return (await pg.getRowsFromTable(
        poolClient,
        USERS_TABLE_NAME
      )) as Array<TUserData>;
    } catch (error) {
      throw new Error(`Users#getUsers -> ${error}`);
    } finally {
      poolClient?.release();
    }
  }

  public async getUser(id: number): Promise<TUserData | null> {
    let poolClient;
    try {
      poolClient = await this._clientPool.connect();
      const result = await pg.getRowFromTable(
        poolClient,
        USERS_TABLE_NAME,
        ["id"],
        [id]
      );

      if (result) {
        return result as TUserData;
      }

      return null;
    } catch (error) {
      throw new Error(`Users#getUser(${id}) -> ${error}`);
    } finally {
      poolClient?.release();
    }
  }

  public async addUser(user: TNewUserData): Promise<TUserData> {
    let poolClient;
    try {
      poolClient = await this._clientPool.connect();

      let result = (await pg.insertRowIntoTable(
        poolClient,
        USERS_TABLE_NAME,
        Object.keys(user),
        Object.values(user)
      )) as TUserData;

      return result;
    } catch (error) {
      throw new Error(`Users#addUser -> ${error}`);
    } finally {
      poolClient?.release();
    }
  }

  public async makeFriends(user1Id: number, user2Id: number): Promise<boolean> {
    if (user1Id === user2Id) {
      return false;
    }

    let poolClient;
    try {
      poolClient = await this._clientPool.connect();
      const user1 = await pg.getRowFromTable(
        poolClient,
        USERS_TABLE_NAME,
        ["id"],
        [user1Id]
      );

      const user2 = await pg.getRowFromTable(
        poolClient,
        USERS_TABLE_NAME,
        ["id"],
        [user2Id]
      );

      if (user1 !== null && user2 !== null) {
        await this._addFriend(
          poolClient,
          user1 as TUserData,
          (user2 as TUserData).id
        );
        await this._addFriend(
          poolClient,
          user2 as TUserData,
          (user1 as TUserData).id
        );
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(`Users#addUser -> ${error}`);
    } finally {
      poolClient?.release();
    }
  }

  public async deleteUser(id: number): Promise<boolean> {
    let poolClient;
    try {
      poolClient = await this._clientPool.connect();
      let result = await pg.deleteRowFromTable(
        poolClient,
        USERS_TABLE_NAME,
        ["id"],
        [id]
      );

      return result;
    } catch (error) {
      throw new Error(`Users#addUser -> ${error}`);
    } finally {
      poolClient?.release();
    }
  }

  private async _addFriend(
    poolClient: PoolClient,
    user: TUserData,
    friendId: number
  ) {
    let friends = [friendId];
    if (user.friends) {
      friends = user.friends?.split(", ").map(Number);
      if (friends && !friends.includes(friendId)) {
        friends.push(friendId);
      }
    }

    await pg.updateRowInTable(
      poolClient,
      USERS_TABLE_NAME,
      "friends",
      friends.join(", "),
      ["id"],
      [user.id]
    );
  }
}
