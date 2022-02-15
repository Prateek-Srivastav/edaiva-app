import client from "./client";

import cache from "../utilities/cache";

const endpoint = "core-service/user";

const updateUser = async (data) => {
  const user = await cache.get("user");

  return client.patch(`${endpoint}/user_update/${user.id}/`, data);
};

const changePassword = ({ oldPassword, newPassword }) =>
  client.patch(`${endpoint}/change-password/`, {
    old_password: oldPassword,
    new_password: newPassword,
  });

export default {
  updateUser,
  changePassword,
};
