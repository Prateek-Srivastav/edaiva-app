import { jobClient as client } from "./client";

const endpoint = "/jobs";

const getJobs = (filters) => {
  const { country, state, city, job_type, experience, skills, keyword, sort } =
    filters;

  Object.keys(filters).forEach((key) => {
    if (
      filters[key] === null ||
      filters[key] === undefined ||
      (Array.isArray(filters[key]) && filters[key].length === 0)
    )
      delete filters[key];
  });

  return client.get(endpoint, {
    recommended: true,
    // country,
    // state,
    // city,
    // job_type,
    // experience,
    // skills,
    // keyword,
    ...filters,
    // sort,
  });
};

const getJobDetails = (jobId) => client.get(`${endpoint}/detail/${jobId}`);

const getJobTypes = () => client.get(`${endpoint}/jobtypes`);

export default {
  getJobs,
  getJobDetails,
  getJobTypes,
};
