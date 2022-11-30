import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}
const getAll = async () => {
  const request = await axios.get(baseUrl)

  return request.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const id = `${baseUrl}/${newBlog.id}`
  const response = await axios.put(id, newBlog, config)

  return response.data
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token }
  }
  const id = `${baseUrl}/${blog.id}`

  const response = await axios.delete(id, config)
  return response.data
}

export default { getAll, setToken, create, update, remove }