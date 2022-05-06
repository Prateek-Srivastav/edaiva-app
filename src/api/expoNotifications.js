import { notificationClient as client } from "./client";

const sendPushToken = (data) =>
  client.post(`notifications/subscribe-expo`, data);

export default { sendPushToken };
