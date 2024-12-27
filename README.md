# Apollo GraphQL Demo

## About

This is a simple learning project for GraphQL and Apollo Server V4. I created it to familiarize myself with the [server](https://www.apollographql.com/docs/apollo-server/v4/) setup and the [GraphQL](https://graphql.org/) syntax.

I've setup the project as a monorepo containing both a frontend and a middleware. Both parts are very simple and just focus on the minimum.

## Technologies

### TypeScript

[Typescript](https://www.typescriptlang.org/) is used to have strong typing throughout the code.

### Vite

[Vite](https://vitejs.dev/) is used to provide a development server for testing of the frontend.

### Typia

Runtime Type validation is done using [Typia](https://github.com/samchon/typia).

### Apollo Server

[Apollo Server V4](https://www.apollographql.com/docs/apollo-server/v4/) provides the GraphQL implementation.

### Postgresql

A Docker [Postgres](https://www.postgresql.org/) image is used to provide an SQL database for the demo.

[SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools) is preinstalled in VS Code to inspect the database.

### Jest

[Jest](https://jestjs.io/) is used for integration testing of the middleware.

## Prerequisites

This project uses a Dev Container to provide the required tools for Web Development. You must have VS Code and the Dev Containers extension installed on your host machine as well as the Docker Engine. On Windows, you can use Docker Desktop, for example. To avoid problems with the mounting of ssh keys, it is recommended, though, to use WSL2 with a Ubuntu distribution and install Docker there.

Here are three video tutorials that will get you started with Docker and Dev Containers:

- [Where Dev Containers are helpful](https://youtu.be/9F-jbT-pHkg?si=yW4RThXZNC0SMIyl)
- [How to create a custom Dev Container](https://youtu.be/7P0pTECkiN8?si=51YPKbUzL7OlAs80)
- [How to configure VS Code Extenstions and Settings in a Dev Container](https://youtu.be/W84R1CxtF0c?si=YBhBRzKk1lgCKEyz)

To prepare the project:

1. Clone or download the repository.
2. Open the project folder in VSCode.
3. `CTRL+Shift+P` and enter "Dev Containers: Rebuild and Reopen in Container".
4. Inside the Dev Container run: `npm i`.

When starting the Dev Container, a Postgres container is also started. It is used to store the data of our demo. This data is available until you delete the container again.

## Development

### frontend

The source code is located under "frontend/src". Before you make changes, start the development server via `npm run dev` inside the "frontend" folder. If you make changes, press `r + Enter` in the console window that is currently running the development server. It will restart the server and reload the page. Automatic reloading will only work, if your host system is Linux-based. If your host system is Windows, file changes are not properly propagated to the Dev Container and Vite will not recognize those automatically.

The frontend app will be available on "http://localhost:80".

### middleware

The source code is located under "services/middleware/src". Before you make changes, start the development server via `npm run dev` inside the "services/middleware" folder. You can then head to "http://localhost:4000/graphql" to access the Apollo playground.

HMR is active: If you make changes to the server code, the server will automatically restart.
