import type { IUsers, TNewUserData, TUserData } from "../data";

export default class UsersService {
  private _users: IUsers;
  constructor(users: IUsers) {
    this._users = users;
  }

  public async getUsers(): Promise<Array<TUserData>> {
    return this._users.getUsers();
  }

  public async getUser(id: number): Promise<TUserData | null> {
    return this._users.getUser(id);
  }

  public async addUser(user: TNewUserData): Promise<TUserData> {
    return this._users.addUser(user);
  }

  public async deleteUser(id: number): Promise<boolean> {
    return this._users.deleteUser(id);
  }

  public async makeFriends(id1: number, id2: number): Promise<boolean> {
    return this._users.makeFriends(id1, id2);
  }
}