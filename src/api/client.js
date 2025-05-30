import axios from "axios";

const SERVER_URL = import.meta.env.VITE_BASE_URL;

const client = axios.create({
  baseURL: `${SERVER_URL}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
