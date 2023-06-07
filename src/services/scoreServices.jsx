import { baseURL } from "./globalServices";
import axios from "axios";

const getAllScores = async () => {
  try {
    const { data } = await axios.get(`${baseURL}/score`, { withCredentials: true });
    return data;
    
  } catch (error) {
    console.error(error);
  }
};

const getScoresByUser = async (username) => {
  try {
    const { data } = await axios.get(`${baseURL}/score/user?username=${username}`, { withCredentials: true });
    return data;
    
  } catch (error) {
    console.error(error);
  }
};

const postScore = async (score) => {
  try {
    const { data } = await axios.post(`${baseURL}/score`, score, {withCredentials: true});
    return data;
  } catch (err) {
    console.log(err, "FAIL TO SUBMIT SCORE");
  }
};

export {getAllScores, getScoresByUser, postScore}
