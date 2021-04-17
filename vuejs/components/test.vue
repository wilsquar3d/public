<template>
	<div>
      {{ JSON.stringify( test ) }}
	</div>
</template>

<script>
	module.exports =
	{
		props:
		{
			test: { type: Object, default: { label: 'test_label', value: 'test_value' } }
		},
		methods:
		{
		}
	}
</script>

<style>
</style>
