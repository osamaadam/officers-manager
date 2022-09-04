import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const BASE_URL = "http://localhost:4000";
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        if (typeof queryKey[0] === "string") {
          const { data } = await axios.get(queryKey[0]);
          return data;
        }
        throw new Error("Invalid query key");
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
