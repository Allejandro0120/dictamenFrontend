let instance = null

const register = (component) => {
    instance = component
}

const show = (message = 'Cargando...') => {
    if (!instance) return

    instance.message = message
    instance.visible = true
}

const hide = () => {
    if (!instance) return

    instance.visible = false
}

export default {
    register,
    show,
    hide
}
