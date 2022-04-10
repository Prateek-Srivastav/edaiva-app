import { jobClient as client } from "./client";

const endpoint = "/jobs";

const getJobs = (filters) => {
  const { country, state, city, job_type, experience, skills, keyword, sort } =
    filters;

  return client.get(endpoint, {
    recommended: true,
    country,
    state,
    city,
    job_type,
    experience,
    skills,
    keyword,
    sort,
  });
};

const getJobDetails = (jobId) => client.get(`${endpoint}/detail/${jobId}`);

const getJobTypes = () => client.get(`${endpoint}/jobtypes`);

export default {
  getJobs,
  getJobDetails,
  getJobTypes,
};
