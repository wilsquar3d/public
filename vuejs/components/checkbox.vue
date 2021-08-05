//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/checkbox.vue

<template>
	<div class='checkboxWrap'>
		<input
			type='checkbox'
			class='checkbox'
			v-model='modelValue'
			@onChange='onChange'
		/>
		<label
			class='checkboxLabel'
			:class='strike && strikeon == modelValue ? "strikeout" : ""'
		>{{label}}</label>
	</div>
</template>

<script>
	module.exports =
	{
		data: () => {
			return {
				modelValue: false
			};
		},
		props:
		{
			label: { type: String, default: null },
			value: { type: Boolean, default: false },
			
			strike: { type: Boolean, default: false },
			strikeon: { type: Boolean, default: true }
		},
		created()
		{
			this.modelValue = this.value;
		},
		methods:
		{
			onChange()
			{
				this.emit( 'change', this.modelValue );
			}
		},
		computed:
		{
		}
	}
</script>

<style scoped>
	.checkboxWrap
	{
		display: inline-block;
	}
	.checkbox
	{
	}
	.checkboxLabel
	{
	}
	.strikeout
	{
		text-decoration: line-through;
	}
</style>
