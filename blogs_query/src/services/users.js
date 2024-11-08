import axios from 'axios';

const baseUrl = '/api/users';

const getUsers = async () => axios.get(baseUrl).then((res) => res.data);

const getUserById = async (id, read = null) => {
  const url = read === null ? `${baseUrl}/${id}` : `${baseUrl}/${id}?read=${read}`;
  return axios.get(url).then((res) => res.data);
};

export { getUsers, getUserById };
