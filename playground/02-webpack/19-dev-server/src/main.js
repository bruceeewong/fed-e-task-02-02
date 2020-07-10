import { getGithubUsers } from "./api.js";

getGithubUsers()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => console.error(err));
