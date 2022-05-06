import client from "./client";

const endpoint = "job-service/jobs";

const getApplications = (applicationId) => {
  if (applicationId)
    return client.get(`${endpoint}/application-candidate/${applicationId}`);

  return client.get(`${endpoint}/application-candidate/`);
};

const postApplication = (data) => client.post(`${endpoint}/application`, data);

const deleteApplication = (applicationId) =>
  client.delete(`${endpoint}/application-candidate/${applicationId}`);

export default {
  getApplications,
  postApplication,
  deleteApplication,
};
