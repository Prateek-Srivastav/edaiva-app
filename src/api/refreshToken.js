import client from "./client";

const refreshToken = (data) =>
  client.post("core-service/user/token/refresh/", data);

export default {
  refreshToken,
};
