import axios from "axios";

export const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API
    : process.env.REACT_APP_DOMAIN;

export const pairService = {
  fetchPairs: async (payload) => {
    const response = await axios.get(
      `${baseUrl}/pairs/${payload.chain}/${payload.factory}`
    );
    return response.data;
  },
};

export const farmService = {
  fetchFarms: async (payload) => {
    const response = await axios.get(`${baseUrl}/farms/${payload}`);
    return response.data.data;
  },
  createFarm: async (payload) => {
    const response = await axios.post(`${baseUrl}/farms`, payload);
    return response.data.data;
  },
  setVisible: async (payload) => {
    const response = await axios.put(`${baseUrl}/farms/invisible`, payload);
    return response.data.data;
  },
};

export const poolService = {
  fetchPools: async (payload) => {
    const response = await axios.get(`${baseUrl}/pools/${payload}`);
    console.log(response);
    return response.data.data;
  },
  createPool: async (payload) => {
    console.log("--------Create Pool Axios--------", payload);
    const response = await axios.post(`${baseUrl}/pools`, payload);
    return response.data.data;
  },
  setVisible: async (payload) => {
    const response = await axios.put(`${baseUrl}/pools/invisible`, payload);
    return response.data.data;
  },
};
