  
<template>
	<div>
		<div id='menu'>
			<div class='menu_item_wrapper'>
				<div
					v-for='menu_item, ndx in menu_items'
					class='menu_item'
					@click='setSelected( menu_item )'
				>{{menu_item.name}}</div>
			</div>
		</div>
		<div id='display'>
			<template v-if='selected_item'>
				<component :is='selected_item'></component>
			</template>
		</div>
	</div>
</template>

<script>
	module.exports =
	{
		data: () => {
			return {
				selected_item: ''
			}
		},
		props:
		{
			menu_items: { type: Array, required: true },
			components: { type: Object, required: true }
		},
		created()
		{
			Object.keys( this.components ).forEach( name )
				{
					Vue.component( name, httpVueLoader( components[name].source ) );
				}
		    	);
		},
		methods:
		{
			setSelected( menu_item )
			{
				console.log( menu_item );
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
	.menu_item_wrapper
	{
		padding: 10px;
	}
	.menu_item
	{
		cursor: pointer;
		margin-bottom: 10px;
		background-color: #FFF;
	}
	.menu_item:hover
	{
		background-color: #CCC;
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
