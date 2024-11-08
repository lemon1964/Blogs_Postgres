import axios from 'axios'

const baseUrl = 'http://localhost:3003/api/blogs/'

let token = null

export const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

export const getBlogs = () => axios.get(baseUrl).then((res) => res.data)

export const createBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

export const update = async ({ id, ...newObject }) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

export const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export const createComment = async (id, newComment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, newComment)
  return response.data
}
