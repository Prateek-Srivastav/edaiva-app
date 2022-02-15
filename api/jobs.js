import { jobClient as client } from "./client";

const endpoint = "/jobs";

const getJobs = (filters) => {
  const { country, state, city, job_type, experience, skills, keyword, sort } =
    filters;

  return client.get(endpoint, {
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

export default {
  getJobs,
  getJobDetails,
};
