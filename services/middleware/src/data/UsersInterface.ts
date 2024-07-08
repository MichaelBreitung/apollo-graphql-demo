import { TUserData, TNewUserData } from "./UsersModel";

export default interface IUsers {
  getUsers(): Promise<Array<TUserData>>;

  getUser(id: number): Promise<TUserData | null>;

  addUser(user: TNewUserData): Promise<TUserData>;

  makeFriends(user1Id: number, user2Id: number): Promise<boolean>;

  deleteUser(id: number): Promise<boolean>;
}
