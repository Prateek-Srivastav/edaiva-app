import { placementClient as client } from "../client";

const endpoint = "student-application/student-application";

const getCampusApplications = (applicationId) => {
  if (applicationId) return client.get(`${endpoint}/${applicationId}`);

  return client.get(`${endpoint}`);
};

const postCampusApplication = (data) =>
  client.post(`${endpoint}/application`, data);

// const deleteApplication = (applicationId) =>
//   client.delete(`${endpoint}/application-candidate/${applicationId}`);

export default {
  getCampusApplications,
  postCampusApplication,
  // deleteApplication,
};
