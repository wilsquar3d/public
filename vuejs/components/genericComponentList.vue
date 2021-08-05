  
//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/genericComponentList.vue

<template>
	<div class='generic_component_list'>
		<div
			v-for='(elem, ndx) in data'
			class='generic_component'
		>
			<component
				:is='type'
				:key='type + "_" + ndx'
				:data='elem'
				@cascade-emit='$cascadeEmit'
			></component>
		</div>
	</div>
</template>

<script type='module'>
	module.exports =
	{
		data: () => {
			return {
			}
		},
		props:
		{
			//path to a component (will be dynamically loaded) or the name of an already loaded component
			//can be relative, but do not include "./"
			component: {
				type: String,
				required: true
			},
			component_is_path: {
				type: Boolean,
				default: false
			},
			data: {
				type: Array,
				required: true
			}
		},
		created()
		{
			if( this.component_is_path )
			{
				Vue.component( this.type, httpVueLoader( this.component ) );
			}
		},
		methods:
		{
		},
		computed:
		{
			type()
			{
				return this.component.split( '/' ).pop().split( '.vue' )[0];
			}
		}
	}
</script>

<style scoped>
	.generic_component_list
	{
	}
	.generic_component
	{
	}
</style>
