import axios from "axios";

const fetchUserData = async ({userName, location, minRepos, page = 1 }) => {
    let query = "";
    if (userName) query += `${userName} in:login`
    if (location) query += `location:${location}`
    if (minRepos) query += `repos:${minRepos} `
    const API_URL = `https://api.github.com/search/users?q=${query}&page=${page}&per_page=20 `;
    const response = await axios.get(API_URL);
return response.data;
};
export default fetchUserData;