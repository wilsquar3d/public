//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/menu/importExportSelective.vue.js
//requires utils.js

components = components || {};

components.importExportSelective = {
	template: `
	<div class='full'>
		<div class='selective'>
			<label>Data Filter: </label>
			<select
				v-for='(layer, ndx) in options'
				:key='"layer-" + ndx'
				:ref='"layer-" + ndx'
				@change='changeLayer( ndx )'
			>
				<option
					v-for='option in layer'
					:key='option + "-" + ndx'
				>{{option}}</option>
			</select>
			<input type='button' value='Show' @click='show_data' />
		</div>
		<textarea class='output' :class='isValid ? "valid" : "invalid"' v-model='filterData' @keyup='onChange'></textarea>
		<div class='actions'>
			<input type='button' value='Import' @click='filter_import_data' style='margin-right:10px;' />
			<input type='button' value='Export' @click='filter_export_data' />
		</div>
		
		<component is='style'>
			.full
			{
				height: 100%;
				width: 100%;
			}
			.selective
			{
				margin: 5px 0;
				text-align: left;
			}
			select
			{
				margin: 0 3px;
			}
			.output
			{
				width: 100%;
				height: calc( 100% - 50px );
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
			filterData: '{}',
			selected: {},
			isValid: true
		};
	},
	created()
	{
		this.set_import_data();
		this.changeLayer();
	},
	methods:
	{
		import_data()
		{
			//examples
			//importExportSelective "this": components.importExportSelective.methods.import_data = function(){ this.data = JSON.stringify( {} ); };
			//external component "this": components.importExportSelective.methods.import_data = () => { return this.sample; };
		},
		export_data( data )
		{
			//examples
			//importExportSelective "this": components.importExportSelective.methods.export_data = function(){ console.log( this.data ); };
			//external component "this": components.importExportSelective.methods.export_data = ( data ) => { console.log( data ): };
		},
		filter_import_data()
		{
			this.set_import_data();
			
			//reset fields
			this.filterData = '{}';
			this.selected = {};
			this.$refs['layer-0'][0].selectedIndex = 0;
		},
		set_import_data()
		{
			let temp = this.import_data();
			if( temp )
			{
				this.data = temp;
			}
		},
		filter_export_data()
		{
			let model = this.data;
			let path = Object.values( this.selected );
			let last = path.pop();
			
			if( !path.length )
			{
				if( last )
				{
					this.data[last] = JSON.parse( this.filterData );
				}
				else
				{
					this.data = JSON.parse( this.filterData );
				}
			}
			else
			{
				path.map( key => { model = model[path.shift()]; } );
				model[last] = JSON.parse( this.filterData );
			}
			
			this.export_data( this.data );
		},
		show_data()
		{
			let model = this.data;
			
			for( const key of Object.keys( this.selected ) )
			{
				if( key && this.selected[key] )
				{
					model = model[this.selected[key]];
				}
			}
			
			this.filterData = JSON.stringify( model, true, '  ' );
		},
		onChange()
		{
			this.isValid = isJson( this.filterData );
		},
		format_data()
		{
			return JSON.stringify( this.data, true, '  ' );
		},
		changeLayer( ndx )
		{
			let layer = 'layer-' + ndx;
			
			if( this.$refs[layer] )
			{
				this.$set( this.selected, layer, this.$refs[layer][0].value );
				
				//remove following layers
				layer = 'layer-' + ( ++ndx );
				while( Object.keys( this.selected ).includes( layer ) )
				{
					this.$delete( this.selected, layer );
					layer = 'layer-' + ( ++ndx );
				}
			}
		}
	},
	computed:
	{
		options()
		{
			let options = [[''].concat( Object.keys( this.data ) )];
			let obj = this.data;
			
			for( const layer of Object.keys( this.selected ) )
			{
				obj = obj[this.selected[layer]];
				
				if( layer && obj && isObject( obj ) )
				{
					options.push( [''].concat( Object.keys( obj ) ) );
				}
			}
			
			return options;
		}
	}
};
