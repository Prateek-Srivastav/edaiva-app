import client from "./client";

const endpoint = "job-service/candidate/profile";

const getProfile = () => client.get(`${endpoint}/`);

const createProfile = (data) => client.post(`${endpoint}/`, data);

const updateProfile = (data) => client.patch(`${endpoint}/`, data);

const uploadProfilePicture = (data) =>
  client.post(`${endpoint}/media/profilepicture`, data);

const uploadResume = (data) => client.post(`${endpoint}/media/resume`, data);

export default {
  getProfile,
  createProfile,
  updateProfile,
  uploadProfilePicture,
  uploadResume,
};
