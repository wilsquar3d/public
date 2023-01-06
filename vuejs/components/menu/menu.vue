//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/menu/menu.vue
//custom menu width?

<template>
	<div id='wrapper'>
		<div id='menu'>
			<div class='menu_item_wrapper'>
				<template v-for='menu_item, ndx in menu_items'>
					<template v-if='menu_item.type'>
						<div v-if='"divider" == menu_item.type && menu_item.name'
							class='menu_item_divider_wrapper'
						>
							<hr class='menu_item_label_divider' />
							<span class='menu_item_divier_label'>{{menu_item.name}}</span>
							<hr class='menu_item_label_divider' />
						</div>
						<div v-else-if='"divider" == menu_item.type'
							class='menu_item_divider_wrapper'
						>
							<hr class='menu_item_divider' />
						</div>
					</template>
					<template v-else>
						<div
							class='menu_item'
							:class='menu_item == selected_item ? "menu_item_selected" : "menu_item_unselected"'
							@click='setSelected( menu_item )'
							:key='menu_item.name'
						>{{menu_item.name}}</div>
					</template>
				</template>
			</div>
		</div>
		<div id='display_wrapper'>
			<div id='display'>
				<template v-if='selected_item.component'>
					<component :is='selected_item.component'></component>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
	module.exports =
	{
		data: () => {
			return {
				selected_item: {}
			}
		},
		props:
		{
			menu_items: { type: Array, required: true },
			default_item: { type: String, default: '' }
		},
		created()
		{
			if( this.default_item )
			{
				this.selected_item = this.menu_items.find( item => item.name == this.default_item );
			}
		},
		methods:
		{
			setSelected( menu_item )
			{
				this.selected_item = menu_item;
			}
		}
	}
</script>

<style>
	#wrapper
	{
		height: 100%;
	}
	#menu
	{
		height: 100%;
		width: 250px;
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
		padding: 3px 0;
	}
	.menu_item:hover
	{
		background-color: #CCC;
	}
	.menu_item_unselected
	{
		color: #000;
		background-color: #FFF;
	}
	.menu_item_selected
	{
		color: #FFF;
		background-color: #000;
	}
	#display_wrapper
	{
		height: 100%;
		width: calc( 100% - 252px );
		padding: 0px;
		margin: 0px;
		border-left: 2px solid rgb(0, 0, 0);
		float: left;
		overflow-y: hidden;
	}
	#display
	{
		margin: 10px;
		height: calc( 100% - 20px );
		overflow-y: auto;
	}
	.menu_item_divider_wrapper
	{
		padding: 0 10px;
	}
	.menu_item_divider
	{
		background-color: #CCC;
	}
	.menu_item_label_divider
	{
		background-color: #CCC;
		display: inline-block;
		width: 20px;
		vertical-align: middle;
	}
	.menu_item_divider_label
	{
		padding: 5px;
		font-size: 80%;
	}
</style>
