import "./index.css";
import App from "./App";
import React from "react";
import { ToastProvider } from "react-toast-notifications";
import ReactDOM from "react-dom/client";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { getDataFromStorage } from "./utils/commonFunctions";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
  headers: {
    authorization: getDataFromStorage("token") || "",
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ApolloProvider>
  </React.StrictMode>
);
