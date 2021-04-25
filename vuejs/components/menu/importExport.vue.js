//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/menu/importExport.vue.js

var components = components || {};

components.importExport = {
	template: `
	<div class='full'>
		<textarea class='output' v-model='data'></textarea>
		<div class='actions'>
			<input type='button' value='Import' @click='import_data( this )' style='margin-right:10px;' />
			<input type='button' value='Export' @click='export_data( this )' />
		</div>
		
		<component is='style'>
			.full
			{
				height: 100%;
				width: 100%;
			}
			.output
			{
				width: 100%;
				height: calc( 100% - 35px );
				white-space: nowrap;
			}
			.actions
			{
				margin: 5px 0;
				height: 25px;
			}
		</component>
	</div>
	`,
	data: () => {
		return {
			data: ''
		};
	},
	methods: {
		import_data( _this )
		{
			//import this.data to ?
		},
		export_data( _this )
		{
			//export ? to this.data
		}
	}
};
