import authStorage from "../auth/storage";
import refreshTokenApi from "../api/refreshToken";

async function refreshAccessToken() {
  console.log("entered");
  const authToken = await authStorage.getToken();
  if (!authToken) return;

  const response = await refreshTokenApi.refreshToken({
    refresh: authToken.refreshToken,
  });
  const { access, refresh } = response.data;
  console.log(access);
  authStorage.removeToken();
  return authStorage.storeToken(access, refresh);
}

export default refreshAccessToken;
