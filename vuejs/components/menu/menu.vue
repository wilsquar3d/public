  
<template>
	<div>
		<div id="menu">
			<div style="padding: 10px;">
				<div
					v-for='menu_item, ndx in menu_items'
					class='menu_item'
					@click='setSelected( menu_item )'
				>{{menu_item.name}}</div>
			</div>
		</div>
		<div id="display">
			<template v-if='selected_item'>
				<component :is='selected_item'></component>
			</template>
		</div>
	</div>
</template>

<script>
	module.exports =
	{
		data:
		{
			selected_item: ''
		},
		props:
		{
			menu_items: { type: Array, default: () => [{ name: 'sample' }] }
		},
		methods:
		{
			setSelected( menu_item )
			{
				this.selected_item = menu_item.component;
			}
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
	#display
	{
		height: 100%;
		width: calc( 100% - 202px );
		padding: 0px;
		margin: 0px;
		border-left: 2px solid rgb(0, 0, 0);
		float: left;
	}
</style>
