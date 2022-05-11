import { create } from "apisauce";

import authStorage from "../auth/storage";
import cache from "../utilities/cache";

// const apiClient = create({
//   baseURL: "http://167.172.236.197:8011/api/gateway",
// });

// export const jobClient = create({
//   baseURL: "http://167.172.236.197:4202/api",
// });

// export const authClient = create({
//   baseURL: "http://167.172.236.197:8011/api/gateway/core-service",
// });

// export const notificationClient = create({
//   baseURL: "http://167.172.236.197:8008",
// });

// export const placementClient = create({
//   baseURL: "http://167.172.236.197:8011/api/gateway/placement-service",
// });

// export const frontEndClient = "http://143.110.241.27:6204";

export const frontEndClient = "https://devjobs.edaiva.com";

export const placementClient = create({
  baseURL: "https://godevgw.edaiva.com/api/gateway/placement-service",
});

export const jobClient = create({
  baseURL: "https://devjobs.edaiva.com/node/api",
});

export const authClient = create({
  baseURL: "https://godevgw.edaiva.com/api/gateway/core-service",
});

const apiClient = create({
  baseURL: "https://godevgw.edaiva.com/api/gateway",
});

export const notificationClient = create({
  baseURL: "https://godevgw.edaiva.com:8007",
});

// export const frontEndClient = "https://jobs.edaiva.com";

// export const placementClient = create({
//   baseURL: "https://apigw-routing.edaiva.com/api/gateway/placement-service",
// });

// export const jobClient = create({
//   baseURL: "https://jobs.edaiva.com/api",
// });

// export const authClient = create({
//   baseURL: "https://apigw-routing.edaiva.com/api/gateway/core-service",
// });

// const apiClient = create({
//   baseURL: "https://apigw-routing.edaiva.com/api/gateway",
// });

// export const notificationClient = create({
//   baseURL: "https://notifs.edaiva.com",
// });

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["Authorization"] = `Bearer ${authToken.accessToken}`;
});

notificationClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["Authorization"] = `Bearer ${authToken.accessToken}`;
});

placementClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["Authorization"] = `Bearer ${authToken.accessToken}`;
});

jobClient.addAsyncRequestTransform(async (request) => {
  const data = await cache.get("user");
  if (!data) return;
  request.headers["Authorization"] = `SW-XH${data.id}`;
});

export default apiClient;
