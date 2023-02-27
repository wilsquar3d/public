//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/menu/importExportWithGit.vue.js
//requires utils.js, encode_decode.js, github_api.proxy.js, request.js
//requires https://crypto.stanford.edu/sjcl/sjcl.js

components = components || {};

components.importExportWithGit = {
	template: `
	<div class='full'>
		<textarea class='output' :class='isValid ? "valid" : "invalid"' v-model='stringData' @keyup='onChange'></textarea>
		<div class='actions'>
			<input type='button' value='Import / Load' @click='import_formatted_data' />
			<input type='button' value='Export / Save' @click='wrap_export_data' />
			<input type='password' v-model='password' />
			<input type='button' value='Commit' @click='gitCommit' />
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
				height: calc( 100% - 30px );
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
			isValid: true,
      			password: ''
		};
	},
	created() {
		this.on_created();
	},
	methods: {
		on_created()
		{
			//override method
		},
		import_data()
		{
			//examples
			//importExport"this": components.importExportWithGit.methods.import_data = function(){ this.data = JSON.stringify( {} ); };
			//external component "this": components.importExportWithGit.methods.import_data = () => { return this.sample; };
		},
		export_data( data )
		{
			//examples
			//importExport "this": components.importExportWithGit.methods.export_data = function(){ console.log( this.data ); };
			//external component "this": components.importExportWithGit.methods.export_data = ( data ) => { console.log( data ): };
		},
		gitProps_data()
		{
			//example
			//components.importExportWithGit.methods.gitProps_data = function(){ return loadGitProps( '<repo>', '<path>/<file.ext>' )' };
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
		},
    
		async gitCommit()
		{
			let props = this.gitProps_data();

			try
			{
				let token = sjcl.decrypt( this.password, atob( props.token ) );

				github_api.setConfig( token, props.repo, props.path );
				await github_api.put( this.stringData );

				this.password = '';
			}
			catch( ex )
			{
				console.log( 'Commit failed' );
				console.error( ex );
			}
		},

		// default import/export
		gm_import_data()
		{
		    return GM_listValues().reduce( (acc, key) => ( acc[key] = GM_getValue( key, {} ), acc ), {} );
		},
		gm_export_data( data )
		{
		    for( const key of Object.keys( data ) )
		    {
                	GM_setValue( key, data[key] );
		    }
		}
	}
};
