import { TUserData, TNewUserData } from "./UsersModel";
import IUsers from "./UsersInterface";

export default class Users implements IUsers {
  private _currentId: number = 0;
  private _users: Array<TUserData>;

  constructor(initialUsers?: Array<TNewUserData>) {
    this._users = [];
    if (initialUsers) {
      initialUsers.forEach((user) => {
        this.addUser(user);
      });
    }
  }

  public async getUsers(): Promise<Array<TUserData>> {
    return this._users;
  }

  public async getUser(id: number): Promise<TUserData | null> {
    if (id >= 0 && id < this._users.length) {
      return this._users[id];
    }

    return null;
  }

  public async addUser(user: TNewUserData): Promise<TUserData> {
    const newUser: TUserData = {
      ...user,
      id: this._currentId++,
    };

    this._users.push(newUser);

    return newUser;
  }

  public async makeFriends(user1Id: number, user2Id: number): Promise<boolean> {
    if (user1Id === user2Id) {
      return false;
    }

    const user1Idx = this._getUserIndexFromId(user1Id);
    const user2Idx = this._getUserIndexFromId(user2Id);

    if (user1Idx !== null && user2Idx !== null) {
      this._addFriend(this._users[user1Idx], user2Id);
      this._addFriend(this._users[user2Idx], user1Id);
      return true;
    } else {
      return false;
    }
  }

  public async deleteUser(id: number): Promise<boolean> {
    const index = this._getUserIndexFromId(id);
    if (index !== null) {
      this._users.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }

  private _addFriend(user: TUserData, friendId: number) {
    let friends = [friendId];
    if (user.friends) {
      friends = user.friends?.split(", ").map(Number);
      if (friends && !friends.includes(friendId)) {
        friends.push(friendId);
      }
    }
    user.friends = friends.join(", ");
  }

  private _getUserIndexFromId(id: number): number | null {
    const index = this._users.findIndex((user) => user.id === id);
    return index === -1 ? null : index;
  }
}
