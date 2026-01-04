import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import PrivateLayout from '@/layouts/PrivateLayout.vue'
import authService from '@/services/authService'
import { hasRole } from '@/utils/roles'
import snackbarService from '@/utils/snackbar.service'

Vue.use(Router)

const router = new Router({
  	mode: 'history',
	routes: [
		{ path: '/login', component: Login, meta: { public: true } },
		{
			path: '/',
            component: PrivateLayout,
            meta: { requiresAuth: true },
			children: [
				{ path: 'home', component: () => import('@/views/HomeView.vue') },
				{ path: 'roles', component: () => import('@/views/Roles.vue') },
				{ path: 'configuracion', component: () => import('@/views/Configuracion.vue'), meta: { roles: ['ADMIN'] } },
				{ path: 'dictamenes', component: () => import('@/views/DictamenesView.vue'), meta: { roles: ['ADMIN', 'GESTOR', 'AUDITOR'] } }
			]
		},
		{ path: '*', redirect: '/login' }
	]
})

router.beforeEach((to, from, next) => {
	const isPublicRoute = to.matched.some(route => route.meta.public)
    const requiresAuth = to.matched.some(route => route.meta.requiresAuth)
	const isAuthenticated = authService.isAuthenticated()
	const rolesPermitidos = to.meta.roles;

    if (requiresAuth && !isAuthenticated) {
        return next('/login')
    }

    if (isPublicRoute && isAuthenticated) {
        return next('/home')
    }

	if (!rolesPermitidos) {
		return next();
	}

	if (hasRole(...rolesPermitidos)) {
		return next();
	}

	snackbarService.show('Ruta no autorizada', 'error')
	return next(false);
})

export default router
