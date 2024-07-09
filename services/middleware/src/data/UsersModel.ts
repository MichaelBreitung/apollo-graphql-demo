export type TDataModel = {
  columns: string;
  constraints: string;
};

// Definition of SQL Columns
// TODO: This is currently a denormalized table, since the friends
// relationships are directly contained in the users table. It's good
// for reads, but adding friendships involves several steps and both
// users need to modify their friends string. Normalization could improve
// this via a friendships table. Reads would become a bit more complex though.
// A separate friendships table could also help, if you are interested in
// displaying all relationships in a graph for example. Then you would want
// access to all the friendships.
export const UsersModel: TDataModel = {
  columns: `
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  nick VARCHAR(255),
  age SMALLINT,
  friends VARCHAR(255)
`,
  constraints: `UNIQUE (name, surname)`,
};

// Input type for new User - no id and no friends yet
export type TNewUserData = {
  name: string;
  surname: string;
  nick?: string;
  age?: number;
};

// Corresponds to UsersModel - Id added by database
export type TUserData = TNewUserData & {
  id: number;
  friends?: string;
};
