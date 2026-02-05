import axios from "axios";

const API = axios.create({
  baseURL: "https://hrms-lite-backend-czi9.onrender.com/employees"
});

export default API;
