import axiosInstance from "axios";
import { config } from "../config/constants";

const configAxios = axiosInstance.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});




export default configAxios;
