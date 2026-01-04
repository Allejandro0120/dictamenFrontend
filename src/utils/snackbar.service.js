import Vue from 'vue'

const bus = new Vue()

export default {
    show(message, color = 'error', timeout = 4000) {
        bus.$emit('snackbar:show', { message, color, timeout })
    },

    listen(callback) {
        bus.$on('snackbar:show', callback)
    }
}
