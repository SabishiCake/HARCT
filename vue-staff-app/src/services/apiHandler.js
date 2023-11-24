import axios from "axios";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const headers = {
  "x-api-key": apiKey,
};
const apiHandler = {
  async getHealth(endpoint) {
    try {
      const response = await axios.get(`${baseUrl}/health`, {
        headers: headers,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  async checkApi() {
    try {
      const response = await axios.get(`${baseUrl}/health/api`, {
        headers: headers,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  async get(endpoint) {
    try {
      const response = await axios.get(`${baseUrl}/${endpoint}`, {
        headers: headers,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  async post(endpoint, data) {
    try {
      const response = await axios.post(`${baseUrl}/${endpoint}`, data, {
        headers: headers,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  async put(endpoint, data) {
    try {
      const response = await axios.put(`${baseUrl}/${endpoint}`, data, {
        headers: headers,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  async delete(endpoint) {
    try {
      const response = await axios.delete(`${baseUrl}/${endpoint}`, {
        headers: headers,
      });
      return response;
    } catch (error) {
      console;
    }
  },
};

export default apiHandler;
