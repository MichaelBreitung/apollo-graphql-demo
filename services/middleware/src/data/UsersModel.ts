export type TDataModel = {
  columns: string;
  constraints: string;
};

// Definition of SQL Columns
// TODO: friends can be optimized later, storing the relation in a separate table
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
