//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/ProgressBar/progressDetail.vue

<template>
	<div
		class='progressDetailWrap'
		:style='"width:" + width'
		:class='alignCenter ? "progressCenter" : ""'
	>

		<div class='progressDetail'>

			<div
				v-if='title'
				class='progressTitle'
			>{{title}}</div>

			<div
				v-if='description'
				class='progressDesc'
			>{{description}}</div>

			<div class='progressBar'>
				<progress-bar
					:progress='progress'
					:description='progressDescription'
				></progress-bar>
			</div>

			<template v-if='log.length'>
				<div class='progressLog'>{{displayLog}}</div>

				<div class='progressLogCollapse'></div>
			</template>

		</div>

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
			progressDescription: {
				type: String,
				default: ''
			},
			log: {
				type: Array,
				default: () => []
			},
			logCollapse: {
				type: Boolean,
				default: false
			},
			width: {
				type: String,
				default: '100%'
			},
			alignCenter: {
				type: Boolean,
				default: false
			}
		},
		components:
		{
			'progress-bar': httpVueLoader( 'https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/ProgressBar/progressBar.vue' )
		},
		computed:
		{
			displayLog()
			{
				return JSON.stringify( this.log );
			}
		}
	};
</script>

<style scoped>
	.progressDetailWrap
	{
		background-color: white;
		padding: 10px;
		border-radius: 7px;
		border: 1px solid lavender;
		text-align: left;
	}
	.progressDetail
	{
		background-color: whitesmoke;
		padding: 10px;
		border-radius: 7px;
	}
	.progressTitle
	{
		font-weight: bold;
		font-size: 20pt;
	}
	.progressDesc
	{
		font-weight: normal;
		font-size: 10pt;
		color: darkslategray;
	}
	.progressBar
	{
		margin: 10px 0 15px 0;
	}
	.progressCenter
	{
		position: relative;
		margin-left: 50%;
		margin-top: 50%;
		transform: translate( -50%, -50% );
	}
</style>
