import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL;


if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    "REACT_APP_API_BASE_URL is not set. Falling back to empty baseURL."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;

