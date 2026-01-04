import api from '@/plugins/axios'

const login = async (payload) => {
    const { data } = await api.post('/users/login', payload)

    localStorage.setItem('token', data.token)

    return data
}

const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('roles')
}

const isAuthenticated = () => {
    return !!localStorage.getItem('token')
}

export default {
    login,
    logout,
    isAuthenticated
}