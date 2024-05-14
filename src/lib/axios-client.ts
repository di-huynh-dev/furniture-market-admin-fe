import axios from 'axios'
import queryString from 'query-string'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  paramsSerializer: (params: object) => queryString.stringify(params),
})

export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params: object) => queryString.stringify(params),
})

export default axiosClient
