import axios from "axios";
const baseUrl = "/api/login";

async function login(data) {
  const response = await axios.post(baseUrl, data);
  return response;
}

export default {login};
