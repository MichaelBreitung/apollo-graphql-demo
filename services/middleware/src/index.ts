// Websockets
import { createServer } from "http";
import { WebSocketServer } from "ws";

// Graphql
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

// Express
import cors from "cors";
import express from "express";

// Other
import { pg } from "./tools";
import type { PostgresConfig } from "./tools";
import { createUsers, TNewUserData } from "./data";
import { getSchema, getContext } from "./graphql";

const initialUsers: Array<TNewUserData> = [
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
  },
  {
    name: "Albert",
    surname: "E",
    nick: "A",
    age: 55,
  },
];

function getConfiguration(): PostgresConfig {
  const postgresHost = process.env.POSTGRES_HOST
    ? process.env.POSTGRES_HOST
    : "postgres";
  const postgresUser = process.env.POSTGRES_USER
    ? process.env.POSTGRES_USER
    : "postgres";
  const postgresPassword = process.env.POSTGRES_PASSWORD
    ? process.env.POSTGRES_PASSWORD
    : "";
  const postgresDb = process.env.POSTGRES_DB ? process.env.POSTGRES_DB : "demo";

  return {
    postgresHost,
    postgresUser,
    postgresPassword,
    postgresDb,
  };
}

const startServer = async (
  withDatabae: boolean = true,
  subscriptionSupport: boolean = true
) => {
  const config = getConfiguration();
  let databasePool;
  if (withDatabae) {
    databasePool = await pg.initializeDatabase(config);
  }

  const users = await createUsers(initialUsers, databasePool);
  const context = getContext(users, subscriptionSupport);
  const schema = getSchema();

  const app = express();
  app.use(cors());
  app.use(express.json());
  const httpServer = createServer(app);

  if (subscriptionSupport) {
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: "/graphql",
    });
    const serverCleanup = useServer({ schema, context }, wsServer);

    const server = new ApolloServer({
      schema,
      csrfPrevention: true,
      cache: "bounded",
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async serverWillStart() {
            return {
              async drainServer() {
                await serverCleanup.dispose();
              },
            };
          },
        },
      ],
    });
    await server.start();

    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async () => context,
      })
    );
  } else {
    const server = new ApolloServer({
      schema,
    });
    await server.start();

    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async () => context,
      })
    );
  }

  httpServer.listen(4000, () => {
    console.log(
      `Apollo Server with Subscription Support is Ready at http://localhost:4000/graphql`
    );
  });
};

startServer();
