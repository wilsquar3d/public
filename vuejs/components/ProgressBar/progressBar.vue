//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/ProgressBar/progressBar.vue

<template>
	<div class="progressBar">

		<div class='progressBarDisplay'>
			<svg class='progressBarSvg'>
				<line
					class='backgroundLine'
					x1='0'
					y1='0'
					x2='100%'
					y2='0'
					></line>
					<line
					class='progressBarLine'
					x1='0'
					y1='0'
					:x2='progress + "%"'
					y2='0'
				></line>
			</svg>
		</div>

		<div class='progressBarPercent'>{{progress}}%</div>

		<div
			v-if='description.length'
			class='progressBarDesc'
		>{{description}}</div>

	</div>
</template>

<script type='module'>
	module.exports =
	{
		props:
		{
			progress: {
				type: [Number, String],
				default: 0
			},
			description: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style scoped>
	.progressBarDisplay
	{
		width: 100%;
		display: table-cell;
		vertical-align: middle;
	}
	.progressBarSvg
	{
		height: 10px;
		width: 100%;
	}
	.backgroundLine
	{
		stroke: lavender;
		stroke-width: 10;
	}
	.progressBarLine
	{
		stroke: #000;
		stroke-width: 10;
	}
	.progressBarPercent
	{
		width: 50px;
		display: table-cell;
		padding-left: 5px;
		font-size: 12pt;
	}
	.progressBarDesc
	{
		font-size: 10pt;
		color: grey;
	}
</style>
