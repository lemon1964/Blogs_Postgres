import axios from "axios";

const baseUrl = "http://localhost:3003/api";

const getUserReadingList = (userId) => axios.get(`${baseUrl}/users/${userId}`).then((res) => res.data);

const addToReadingList = (blogId, userId) =>
  axios.post(`${baseUrl}/readinglists`, { blogId, userId }).then((res) => res.data);

const markAsRead = (readingListId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return axios
    .put(`${baseUrl}/readinglists/${readingListId}`, { read: true }, config)
    .then((res) => res.data);
};

const getBlogs = () => axios.get(`${baseUrl}/blogs`).then((res) => res.data);

const logout = (token) => {
  return axios.delete(`api/logout`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default { getUserReadingList, addToReadingList, markAsRead, getBlogs, logout };
