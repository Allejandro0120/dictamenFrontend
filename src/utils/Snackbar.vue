<template>
    <v-snackbar
        v-model="visible"
        :color="color"
        :timeout="timeout"
        top
        right
    >
        {{ message }}
        <template v-slot:action="{ attrs }">
            <v-btn
                icon
                v-bind="attrs"
                @click="visible = false"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import snackbarService from './snackbar.service'

export default {
    name: 'AppSnackbar',

    data() {
        return {
            visible: false,
            message: '',
            color: 'error',
            timeout: 4000
        }
    },

    created() {
        snackbarService.listen(this.show)
    },

    methods: {
        show({ message, color = 'error', timeout = 4000 }) {
            this.message = message
            this.color = color
            this.timeout = timeout
            this.visible = true
        }
    }
}
</script>
