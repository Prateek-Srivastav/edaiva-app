import { placementClient as client } from "../client";

const endpoint = "batches/student-institution";

const getProfile = () => client.get(`${endpoint}/details`);

// const createProfile = (data) => client.post(`${endpoint}/`, data);

const updateProfile = (data) => client.patch(`${endpoint}/profile`, data);

// const uploadProfilePicture = (data) =>
//   client.post(`${endpoint}/media/profilepicture`, data);

// const uploadResume = (data) => client.post(`${endpoint}/media/resume`, data);

export default {
  getProfile,
  // createProfile,
  updateProfile,
  // uploadProfilePicture,
  // uploadResume,
};
