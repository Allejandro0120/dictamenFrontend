<template>
	<v-app>
		<v-main class="grey lighten-4">
			<router-view/>
			<AppSnackbar />
			<loading />
		</v-main>
	</v-app>
</template>

<script>
import AppSnackbar from '@/utils/Snackbar.vue'
import loading from '@/utils/loading.vue'
export default {
	components: {
		AppSnackbar,
		loading
	},
	name: 'App',

	data: () => ({
		//
	}),
};
</script>

<style>
	html,
	body {
		margin: 0;
		padding: 0;
		height: 100%;
		overflow: hidden;
	}
	.main-no-padding {
		padding-top: 10px !important;
		padding-left: 10px !important;
	}
	::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
</style>