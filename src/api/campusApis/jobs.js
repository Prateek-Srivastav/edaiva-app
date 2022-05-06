import { placementClient as client } from "../client";

const endpoint = "/job-institution";

const getCampusJobs = () => {
  return client.get(`${endpoint}/student`);
};

const getCampusJobDetails = (jobId) =>
  client.get(`${endpoint}/job-institute-detail/student/${jobId}`);

export default {
  getCampusJobs,
  getCampusJobDetails,
};
