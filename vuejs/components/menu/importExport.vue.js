//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/menu/importExport.vue.js
//requires utils.js

components = components || {};

components.importExport = {
	template: `
	<div class='full'>
		<textarea class='output' :class='isValid ? "valid" : "invalid"' v-model='stringData' @keyup='onChange'></textarea>
		<div class='actions'>
			<input type='button' value='Import' @click='import_formatted_data' style='margin-right:10px;' />
			<input type='button' value='Export' @click='wrap_export_data' />
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
			data: {},
			stringData: '{}',
			isValid: true
		};
	},
	methods: {
		import_data()
		{
			//examples
			//importExport"this": components.importExport.methods.import_data = function(){ this.data = JSON.stringify( {} ); };
			//external component "this": components.importExport.methods.import_data = () => { return this.sample; };
		},
		export_data( data )
		{
			//examples
			//importExport "this": components.importExport.methods.export_data = function(){ console.log( this.data ); };
			//external component "this": components.importExport.methods.export_data = ( data ) => { console.log( data ): };
		},
		wrap_export_data()
		{
			this.export_data( JSON.parse( this.stringData ) );
		},
		onChange()
		{
			this.isValid = isJson( this.stringData );
		},
		import_formatted_data()
		{
			let temp = this.import_data();
			if( temp )
			{
				this.data = temp;
			}
			
			this.stringData = JSON.stringify( this.data, true, '  ' );
			this.onChange();
		}
	}
};
