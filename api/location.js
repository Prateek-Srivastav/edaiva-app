import { jobClient as client } from "./client";

const endpoint = "/country";

const getCountries = () => client.get(endpoint);

const getStates = (state) => client.get(`${endpoint}/${state}`);

export default {
  getCountries,
  getStates,
};
