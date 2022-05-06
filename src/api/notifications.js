import { notificationClient as client } from "./client";

const endpoint = "/notifications/user";

const getNotifications = (portal) => client.get(`${endpoint}`, { portal });

const markSeenNotifications = (portal) =>
  client.get(`${endpoint}/markSeen`, { portal });

const deleteNotification = (notificationId) =>
  client.delete(`${endpoint}/${notificationId}`);

export default {
  getNotifications,
  markSeenNotifications,
  deleteNotification,
};
