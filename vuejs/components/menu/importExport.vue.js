//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/menu/importExport.vue.js
//requires utils.js

var components = components || {};

components.importExport = {
	template: `
	<div class='full'>
		<textarea class='output' :class='isValid ? "valid" : "invalid"' v-model='data' @keyup='onChange'></textarea>
		<div class='actions'>
			<input type='button' value='Import' @click='import_formatted_data' style='margin-right:10px;' />
			<input type='button' value='Export' @click='export_data' />
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
				height: calc( 100% - 25px );
				white-space: nowrap;
			}
			.valid
			{
				background-color: #fff;
			}
			.invalid
			{
				background-color: #fbcfcf;
			}
			.actions
			{
				margin: 5px 0;
			}
		</component>
	</div>
	`,
	data: () => {
		return {
			data: '{}',
			isValid: true
		};
	},
	methods: {
		import_data()
		{
			//example: components.importExport.methods.import_data = function(){ this.data = JSON.stringify( {} ); };
			//import this.data to ?
		},
		export_data()
		{
			//export ? to this.data
		},
		onChange()
		{
			this.isValid = isJson( this.data );
		},
		import_formatted_data()
		{
			this.import_data();
			this.data = this.format_data();
			this.onChange();
		},
		format_data()
		{
			return JSON.stringify( JSON.parse( this.data ), true, '  ' );
		}
	}
};
