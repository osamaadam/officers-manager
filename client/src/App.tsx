import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

const App = () => {
  const {
    mutate,
    data: loginData,
    isLoading,
  } = useMutation(["user/login"], async () => {
    const { data: loginData } = await axios.post<{
      username: string;
    }>("user/login", {
      username: "dumb",
      password: "dumber",
    });

    return loginData;
  });

  useEffect(() => {
    mutate();
  }, []);

  if (isLoading) return <h1>صباحو</h1>;
  return <h1>{loginData?.username}</h1>;
};

export default App;
