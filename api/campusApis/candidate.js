import { placementClient as client } from "../client";

const endpoint = "batches";

const getProfile = () => client.get(`${endpoint}/student-institution/details`);

// const createProfile = (data) => client.post(`${endpoint}/`, data);

const updateProfile = (data) =>
  client.patch(`${endpoint}/student-institution/profile`, data);

// const uploadProfilePicture = (data) =>
//   client.post(`${endpoint}/media/profilepicture`, data);

// const uploadResume = (data) => client.post(`${endpoint}/media/resume`, data);

const joinBatch = (data) => client.post(`${endpoint}/join-batch`, data);

export default {
  getProfile,
  // createProfile,
  updateProfile,
  // uploadProfilePicture,
  // uploadResume,
  joinBatch,
};
