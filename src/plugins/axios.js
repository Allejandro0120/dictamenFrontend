// src/plugins/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status
        const isAuthError = status === 401 || status === 403
        const isLoginRoute = window.location.pathname.includes('/login')

        if (isAuthError && !isLoginRoute) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)

export default api
