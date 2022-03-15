import { placementClient as client } from "../client";

const endpoint = "student-application";

const getCampusApplications = (applicationId) => {
  if (applicationId)
    return client.get(`${endpoint}/student-application/${applicationId}`);

  return client.get(`${endpoint}/student-application`);
};

const postCampusApplication = (application) =>
  client.post(`${endpoint}/`, { job_institute: application });

// const deleteApplication = (applicationId) =>
//   client.delete(`${endpoint}/application-candidate/${applicationId}`);

export default {
  getCampusApplications,
  postCampusApplication,
  // deleteApplication,
};
