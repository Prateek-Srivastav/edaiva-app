import client from "./client";

const endpoint = "/job-service/interview/candidate-interviews";

const getInterviews = () => client.get(endpoint);

const getApplicationInterviews = (applicationId) =>
  client.get(`${endpoint}/${applicationId}`);

export default {
  getInterviews,
  getApplicationInterviews,
};
