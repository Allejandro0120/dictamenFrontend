import api from '@/plugins/axios'

const generarDictamenPdf = async (dictamenId) => {
    const { data } = await api.get(`pdf/${dictamenId}`)

    return data
}

export default {
    generarDictamenPdf
}