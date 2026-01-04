<template>
    <v-dialog
        v-model="visible"
        persistent
        width="300"
        overlay-opacity="0.6"
    >
        <v-card
            class="d-flex flex-column align-center justify-center pa-6"
            elevation="8"
            style="background-color: #333333;"
        >
            <v-progress-circular
                indeterminate
                size="48"
                width="4"
                color="secondary"
            />

            <v-card-text class="mt-4" style="font-size: 18px; color: #FFA500;">
                {{ message }}
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import loadingService from './loadingService'

export default {
    name: 'LoadingDialog',

    data() {
        return {
            visible: false,
            message: 'Cargando...'
        }
    },

    created() {
        loadingService.register(this)
    }
}
</script>
