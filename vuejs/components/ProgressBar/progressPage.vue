//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/ProgressBar/progressPage.vue

<template>
	<div class='progressPage'>
		<progress-detail
			:title='title'
			:description='description'
			:progress='progress'
			:progress_description='progress_description'
			:log='log'
			:log_collapse='log_collapse'
			:width='width'
			align_center
		></progress-detail>
	</div>
</template>

<script type='module'>
	module.exports =
	{
		props:
		{
			title: {
				type: String,
				default: ''
			},
			description: {
				type: String,
				default: ''
			},
			progress: {
				type: [Number, String],
				default: 0
			},
			progress_description: {
				type: String,
				default: ''
			},
			log: {
				type: Array,
				default: () => []
			},
			log_collapse: {
				type: Boolean,
				default: false
			},
			width: {
				type: String,
				default: '100%'
			}
		},
		components:
		{
			'progress-detail': httpVueLoader( 'https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/ProgressBar/progressDetail.vue' )
		}
	};
</script>

<style scoped>
	.progressPage
	{
		background-color: #5a5a5a;
		padding: 0;
		margin: 0;
		text-align: left;
		overflow: hidden;
		width: 100%;
		height: 100%;
	}
</style>
