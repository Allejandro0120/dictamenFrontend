<template>
    <v-app>
        <v-navigation-drawer
            app
            color="accent"
            v-model="drawer"
            :mini-variant="mini"
            :mini-variant-width="0"
            clipped
        >
            <v-list dense>
                <v-list-item link to="/dictamenes">
                    <v-list-item-icon>
                        <v-icon>mdi-file-document</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content v-if="!mini">
                        <v-list-item-title>
                            DICTÁMENES
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <!-- <v-list-group
                    :value="true"
                    no-action
                    sub-group
                    prepend-icon="mdi-cog"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title class="font-weight-bold">ADMINISTRACIÓN</v-list-item-title>
                        </v-list-item-content>
                    </template>

                    <v-list-item link to="/configuracion">
                        <v-list-item-icon>
                            <v-icon>mdi-shield-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content v-if="!mini">
                            <v-list-item-title>
                                Usuarios
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group> -->

                

            </v-list>
        </v-navigation-drawer>

        <v-app-bar
            app
            dark
            clipped-left
        >
            <v-btn icon @click="toggleDrawer">
                <v-icon>mdi-menu</v-icon>
            </v-btn>

            <div class="d-flex align-center">
				<v-img
					alt="Occ Logo"
					class="shrink mr-2"
					contain
					src="@/assets/LOGO-ACREDITADO1.png"
					transition="scale-transition"
					width="160"
				/>
			</div>

            <v-spacer />

            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        text
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon left>mdi-account</v-icon>
                        {{ userName }}
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item @click="logout">
                        <v-list-item-title>
                            Cerrar sesión
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <v-main class="main-no-padding grey lighten-4">
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import authService from '@/services/authService'

export default {
    name: 'PrivateLayout',

    data() {
        return {
            drawer: true,
            mini: false,
            user: null
        }
    },

    computed: {
        userName() {
            return this.user?.NOMBRE || 'Usuario'
        }
    },

    mounted() {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            this.user = JSON.parse(storedUser)
        }
    },

    methods: {
        toggleDrawer() {
            if (this.drawer && !this.mini) {
                this.mini = true
            } else if (this.drawer && this.mini) {
                this.mini = false
            } else {
                this.drawer = true
            }
        },

        logout() {
            authService.logout()
            this.$router.push('/login')
        }
    }
}
</script>

<style scoped>
.no-active-group {
    background-color: transparent !important;
    height: calc(100vh - 64px);
    overflow-y: auto;
    overflow-x: hidden;
}
</style>