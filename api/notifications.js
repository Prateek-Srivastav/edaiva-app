import { notificationClient as client } from "./client";

const endpoint = "/notifications/user";

const getNotifications = (portal) => client.get(`${endpoint}`, { portal });

const postApplication = (portal) =>
  client.post(`${endpoint}/markSeen?portal=${portal}`, data);

const deleteNotification = (notificationId) =>
  client.delete(`${endpoint}/${notificationId}`);

export default {
  getNotifications,
  postApplication,
  deleteNotification,
};
