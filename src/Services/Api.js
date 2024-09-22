import Axios from "axios";
export const IMAGES_DOMAIN = process.env.IMAGES_DOMAIN;
export const API_KEY = process.env.API_KEY;
export const API_END_POINT = process.env.API_END_POINT;
export const EDITOR_API_KEY = process.env.EDITOR_API_KEY;

export const api = Axios.create({
  baseURL: API_END_POINT,
  headers: {
    "Content-Type": "application/json",
  },
});
export const setToken = (token) => {
  api.defaults.headers.common.Authorization = token;
};
