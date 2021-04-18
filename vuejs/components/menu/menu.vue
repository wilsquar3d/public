  
<template>
	<div id="menu">
		<div style="padding: 10px;">
			<div
				v-for='menu_item, ndx in menu_items'
				class='menu_item'
			>{{menu_item.name}}</div>
		</div>
	</div>
</template>

<script>
	module.exports =
	{
		props:
		{
			menu_items: { type: Array, default: () => [] }
		},
		methods:
		{
		}
	}
</script>

<style>
	#menu
	{
		height: 100%;
		width: 200px;
		padding: 0px;
		margin: 0px;
		float: left;
	}
	.menu_item
	{
		cursor: pointer;
		margin-bottom: 10px;
		background-color: #FFF;
	}
</style>
