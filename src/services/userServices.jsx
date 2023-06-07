import { baseURL } from "./globalServices";
import axios from "axios";

const getUser = async () => {
  try {
    const { data } = await axios.get(`${baseURL}/user/verify`, { withCredentials: true });
    return data;
    
  } catch (error) {
    console.error(error);
  }
};

const signup = async (user) => {
  try {
    const { data } = await axios.post(`${baseURL}/user/signup`, user, {withCredentials: true});
    return data;
  } catch (err) {
    console.log(err, "FAIL TO SIGN UP");
  }
};

const login = async (userData) => {
  try {
    const { data } = await axios.post(`${baseURL}/user/login`, userData, {withCredentials: true});
    return data;
  } catch (err) {
    console.log(err);
  }
};

const logout = async () => {
  try {
    const { data } = await axios.get(`${baseURL}/user/logout`, {withCredentials: true} );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export {getUser, login, logout, signup}
