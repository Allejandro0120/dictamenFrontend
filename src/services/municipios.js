import api from '@/plugins/axios'

const getDepartamentos = async (params) => {
    const { data } = await api.get('/municipios/departamentos', { params })

    return data
}

const getMunicipiosByDepto = async (departamentoId) => {
    const { data } = await api.get(`municipios/departamentos/${departamentoId}`)
    return data
}

export default {
    getDepartamentos,
    getMunicipiosByDepto
}