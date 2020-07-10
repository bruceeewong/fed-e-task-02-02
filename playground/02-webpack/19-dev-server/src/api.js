import axios from "axios";

export const getGithubUsers = (params) => {
  return axios.get("/api/users", {
    params,
  });
};
