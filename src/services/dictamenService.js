import api from '@/plugins/axios'

const getDictamenes = async (params) => {
    const { data } = await api.get('/dictamenes', { params })

    return data
}

const getTiposDictamen = async () => {
    const { data } = await api.get('/dictamenes/tipos')
    return data
}

const createDictamen = async (data) => {
    const { data: response } = await api.post('/dictamenes', data)
    return response
}

const getTiposConstruccion = async () => {
    const { data } = await api.get('/dictamenes/tiposConstruccion')
    return data
}

const getZonas = async () => {
    const { data } = await api.get('/dictamenes/zonas')
    return data
}

const getServicios = async () => {
    const { data } = await api.get('/dictamenes/servicios')
    return data
}

const getUsos = async () => {
    const { data } = await api.get('/dictamenes/usos')
    return data
}

const getTiposConfig = async () => {
    const { data } = await api.get('/dictamenes/tiposConfig')
    return data
}

const getEvaluaciones = async () => {
    const { data } = await api.get('/dictamenes/evaluaciones')
    return data
}

const getNroDictamen = async () => {
    const { data } = await api.get('/dictamenes/nroDictamen')
    return data
}

const updateNroDictamen = async (payload) => {
    const { data } = await api.put('/dictamenes/nroDictamen', payload)
    return data
}

const getTiposProcesoAsoc = async () => {
    const { data } = await api.get('/dictamenes/tiposProcesoAsoc')
    return data
}

const getTiposSubestacion = async () => {
    const { data } = await api.get('/dictamenes/tiposSubestacion')
    return data
}

const getTiposInstalacion = async () => {
    const { data } = await api.get('/dictamenes/tiposInstalacion')
    return data
}

const getTiposUsoFinal = async () => {
    const { data } = await api.get('/dictamenes/tiposUsoFinal')
    return data
}

const getDictamenById = async (dictamenId) => {
    const { data } = await api.get(`/dictamenes/data/${dictamenId}`)
    return data
}

const updateDictamen = async (payload, dictamenId) => {
    const { data } = await api.put(`/dictamenes/update/${dictamenId}`, payload)
    return data
}

export default {
    getDictamenes,
    getTiposDictamen,
    createDictamen,
    getTiposConstruccion,
    getZonas,
    getServicios,
    getUsos,
    getTiposConfig,
    getTiposProcesoAsoc,
    getTiposSubestacion,
    getTiposInstalacion,
    getTiposUsoFinal,
    getEvaluaciones,
    getNroDictamen,
    updateNroDictamen,
    getDictamenById,
    updateDictamen
}