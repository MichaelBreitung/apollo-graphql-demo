import { Client, PoolClient, Pool } from "pg";

export type PostgresConfig = {
  postgresHost: string;
  postgresUser: string;
  postgresDb: string;
  postgresPassword: string;
};

async function initializeDatabase(config: PostgresConfig): Promise<Pool> {
  const defaultClient = new Client({
    user: config.postgresUser,
    host: config.postgresHost,
    password: config.postgresPassword,
    database: config.postgresDb,
    port: 5432,
  });
  try {
    await defaultClient.connect();
    const databaseExists = await doesDatabaseExist(
      defaultClient,
      config.postgresDb
    );
    if (!databaseExists) {
      createDatabase(defaultClient, config.postgresDb);
    }
  } catch (error) {
    throw new Error(`PG: initializeDatabase -> ${error}`);
  } finally {
    defaultClient.end();
  }

  return new Pool({
    user: config.postgresUser,
    host: config.postgresHost,
    password: config.postgresPassword,
    database: config.postgresDb,
    port: 5432,
  });
}

async function doesDatabaseExist(
  client: PoolClient | Client,
  databaseName: string
): Promise<boolean> {
  const query = `SELECT * FROM pg_database WHERE datname = '${databaseName}'`;
  console.log("PG:", query);
  const result = await client.query(query);
  return result.rows.length > 0;
}

async function createDatabase(
  client: PoolClient | Client,
  databaseName: string
) {
  const query = `CREATE DATABASE ${databaseName}`;
  console.log("PG:", query);
  await client.query(query);
}

async function doesTableExist(
  client: PoolClient | Client,
  table: string
): Promise<boolean> {
  const query = `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE  table_schema = 'public'
      AND    table_name   = '${table}'
      )`;
  console.log("PG:", query);
  const result = await client.query(query);
  return result.rows[0].exists;
}

async function createTable(
  client: PoolClient | Client,
  table: string,
  columnDefinitions: string,
  constraints?: string
): Promise<void> {
  const query = `CREATE TABLE ${table} ( ${columnDefinitions} ${
    constraints ? ", " + constraints : ""
  })`;
  console.log("PG:", query);
  await client.query(query);
}

async function insertRowIntoTable(
  client: PoolClient | Client,
  table: string,
  columns: Array<string>,
  values: Array<string | number>,
  returning: boolean = true
): Promise<unknown> {
  if (columns.length != values.length) {
    throw new Error("PG insertRowIntoTable -> invalid");
  }
  const query = `INSERT INTO ${table} (${columns.join(
    ", "
  )}) VALUES (${values.map((value) => `'${value}'`)}) ${
    returning ? "RETURNING *" : ""
  }`;
  console.log("PG:", query);
  const result = await client.query(query);
  return result.rows[0];
}

async function findRowInTable(
  client: PoolClient | Client,
  table: string,
  columns: Array<string>,
  values: Array<string | number>
): Promise<boolean> {
  if (!columns.length || !values.length || columns.length != values.length) {
    throw new Error("PG findRowInTable -> invalid");
  }
  let query = `SELECT * FROM ${table} WHERE ${columns[0]} = '${values[0]}'`;
  for (let i = 1; i < columns.length; ++i) {
    query += ` AND ${columns[i]} = '${values[i]}'`;
  }

  console.log("PG:", query);
  const result = await client.query(query);
  return result.rowCount != 0;
}

async function getRowsFromTable(
  client: PoolClient | Client,
  table: string
): Promise<Array<unknown>> {
  const query = `SELECT * FROM ${table}`;
  console.log("PG:", query);
  const result = await client.query(query);
  return result.rows;
}

async function getRowFromTable(
  client: PoolClient | Client,
  table: string,
  columns: Array<string>,
  values: Array<string | number>
): Promise<unknown> {
  if (!columns.length || !values.length || columns.length != values.length) {
    throw new Error("PG: getRowFromTable -> invalid");
  }
  let query = `SELECT * FROM ${table} WHERE ${columns[0]} = '${values[0]}'`;
  for (let i = 1; i < columns.length; ++i) {
    query += ` AND ${columns[i]} = '${values[i]}'`;
  }

  console.log("PG:", query);
  const result = await client.query(query);
  return result.rows[0];
}

async function updateRowInTable(
  client: PoolClient | Client,
  table: string,
  updateColumn: string,
  updateValue: string | number | null,
  columns: Array<string>,
  values: Array<string | number>
): Promise<unknown> {
  if (!columns.length || !values.length || columns.length != values.length) {
    throw new Error("PG: updateRowInTable -> invalid");
  }
  let query = `UPDATE ${table} SET ${updateColumn} = '${updateValue}' WHERE ${columns[0]} = '${values[0]}'`;
  for (let i = 1; i < columns.length; ++i) {
    query += ` AND ${columns[i]} = '${values[i]}'`;
  }

  console.log("PG:", query);
  const result = await client.query(query);
  return result.rows[0];
}

async function deleteRowFromTable(
  client: PoolClient | Client,
  table: string,
  columns: Array<string>,
  values: Array<string | number>
): Promise<boolean> {
  if (!columns.length || !values.length || columns.length != values.length) {
    throw new Error("PG: deleteRowFromTable -> invalid");
  }
  let query = `DELETE FROM ${table} WHERE ${columns[0]} = '${values[0]}'`;
  for (let i = 1; i < columns.length; ++i) {
    query += ` AND ${columns[i]} = '${values[i]}'`;
  }

  console.log("PG:", query);
  const result = await client.query(query);
  return result.rows.length > 0;
}

export const pg = {
  initializeDatabase,
  doesDatabaseExist,
  createDatabase,
  doesTableExist,
  createTable,
  insertRowIntoTable,
  findRowInTable,
  getRowsFromTable,
  getRowFromTable,
  updateRowInTable,
  deleteRowFromTable,
};
