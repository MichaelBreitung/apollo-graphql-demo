import { Pool } from "pg";

import UsersMemory from "./UsersMemory";
import UsersPostgres from "./UsersPostgres";
import IUsers from "./UsersInterface";
import { TNewUserData, TUserData } from "./UsersModel";

export type { IUsers, TNewUserData, TUserData };

export async function createUsers(
  initialUsers?: Array<TNewUserData>,
  databasePool?: Pool
): Promise<IUsers> {
  if (databasePool) {
    const users = new UsersPostgres(databasePool);
    await users.init(initialUsers);
    return users;
  } else {
    return new UsersMemory(initialUsers);
  }
}
