import { useCallback, useState } from "react";
import { useSubscription, gql } from "@apollo/client";
import "./App.css";

import { graphQLUrl, restGetUsers } from "./constants.ts";

const USER_CREATED = gql`
  subscription UserCreated {
    userCreated {
      name
    }
  }
`;

function App() {
  const [data, setData] = useState<string>("");
  const subscription = useSubscription(USER_CREATED);

  const fetchUsers = useCallback(async () => {
    try {
      const fetched = await fetch(graphQLUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: "query { users {name} }" }),
      });

      const data = await fetched.json();
      setData(JSON.stringify(data));
    } catch (e: unknown) {
      console.error("Exception: ", e);
    }
  }, []);

  const getSchema = useCallback(async () => {
    try {
      const fetched = await fetch(graphQLUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: "{ __schema { types { name }} }" }),
      });

      const data = await fetched.json();
      setData(JSON.stringify(data));
    } catch (e: unknown) {
      console.error("Exception: ", e);
    }
  }, []);

  const fetchUsersREST = useCallback(async () => {
    try {
      const fetched = await fetch(restGetUsers, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await fetched.json();
      setData(JSON.stringify(data));
    } catch (e: unknown) {
      console.error("Exception: ", e);
    }
  }, []);

  return (
    <div id="main" className="v-container">
      <h1 className="t-center">GraphQL Tester</h1>
      <div className="h-container">
        {" "}
        <button onClick={getSchema}>Get Schema</button>{" "}
        <button onClick={fetchUsers}>Fetch Users</button>
        <button onClick={fetchUsersREST}>Fetch Users REST</button>
      </div>
      <p>Data:</p>
      <p>{data}</p>
      <p>User Created Subscription:</p>
      <pre>
        {subscription.loading
          ? "...loading"
          : JSON.stringify(subscription.data, null, 2)}
      </pre>
    </div>
  );
}

export default App;
