<template>
    <v-container fluid fill-height class="login-bg">
        <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
            <v-card class="login-card" elevation="8">
            
            <!-- Header -->
            <v-card-text class="text-center">
                <v-avatar size="72" class="mb-4">
                <v-icon size="48" color="secondary">mdi-account-circle</v-icon>
                </v-avatar>

                <h2 class="login-title">Iniciar sesión</h2>
                <p class="login-subtitle">
                Accede a tu cuenta
                </p>
            </v-card-text>

            <!-- Form -->
            <v-card-text>
                <v-form ref="form" v-model="valid">
                <v-text-field
                    v-model="identifier"
                    label="Usuario o correo electrónico"
                    prepend-inner-icon="mdi-account"
                    outlined
                    dense
                    :rules="identifierRules"
                />

                <v-text-field
                    v-model="password"
                    label="Contraseña"
                    prepend-inner-icon="mdi-lock"
                    outlined
                    dense
                    type="password"
                    :rules="passwordRules"
                />
                </v-form>
            </v-card-text>

            <!-- Actions -->
            <v-card-actions class="px-6 pb-6">
                <v-btn
                block
                large
                color="secondary"
                class="login-btn"
                :loading="loading"
                @click="login"
                >
                Ingresar
                </v-btn>
            </v-card-actions>

            <!-- Footer -->
            <v-card-text class="text-center pt-0">
                <small class="login-footer">
                ¿Olvidaste tu contraseña?
                </small>
            </v-card-text>

            </v-card>
        </v-col>
        </v-row>
    </v-container>
</template>


<script>
    import authService from '@/services/authService'
    import snackbarService from '@/utils/snackbar.service'

    export default {
    name: 'Login',

    data() {
        return {
        valid: false,
        loading: false,
        identifier: '',
        password: '',
        identifierRules: [
            v => !!v || 'El usuario o correo es obligatorio'
        ],
        passwordRules: [
            v => !!v || 'La contraseña es obligatoria'
        ]
        }
    },

    methods: {
        async login() {
            if (!this.$refs.form.validate()) return

            this.loading = true
            try {
                const identifierTrimmed = this.identifier.trim().toLowerCase()
                const { data } = await authService.login({
                    identifier: identifierTrimmed,
                    PASSWORD: this.password
                })
                if (data.token) {
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('user', JSON.stringify(data.usuario))
                    localStorage.setItem('roles', JSON.stringify(data.roles))
                    this.$router.push('/')
                }
            } catch (error) {
                snackbarService.show(error.response.data.message, 'error')
            } finally {
                this.loading = false
            }
        }
    }
}
</script>
<style scoped>
    .login-bg {
    background-color: #f4f4f4;
    }

    .login-card {
    border-radius: 16px;
    }

    .login-title {
    font-weight: 600;
    color: #333;
    }

    .login-subtitle {
    font-size: 14px;
    color: #777;
    }

    .login-btn {
    border-radius: 8px;
    font-weight: 600;
    text-transform: none;
    }

    .login-footer {
    color: #999;
    cursor: pointer;
    }

    .login-footer:hover {
    text-decoration: underline;
    }
</style>
