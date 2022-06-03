import client from "./client";

const endpoint = "/job-service/interview";

const getInterviews = () => client.get(endpoint + "/candidate-interviews");

const getApplicationInterviews = (applicationId) =>
  client.get(`${endpoint}/candidate-interviews/${applicationId}`);

const rescheduleInterview = (data) =>
  client.post(`${endpoint}/reschedule-interview-candidate`, data);

export default {
  getInterviews,
  getApplicationInterviews,
  rescheduleInterview,
};
