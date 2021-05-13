//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/tree.vue.js

components = components || {};

components.tree = {
	template: `
	<div class='tree'>
			<div
			v-for='(elem, ndx) in props.elements'
			:key='ndx'
			class='branch'
		>
			<div
				v-if='hasChildren( elem )'
				class='collapsible one-line'
				:class='hasChildren( elem ) ? "link" : ""'
				@click='setExpansion( elem )'
			>{{expandedState[displayLabel( elem )] ? settings.config.openSymbol : settings.config.closedSymbol}}</div>
			<div
				v-else
				class='filler one-line'
			></div>
			<input
				v-model='elem[settings.fields.isChecked]'
				type='checkbox'
				class='one-line'
			/>
			<div class='label'>{{displayLabel( elem )}}</div>
			<template
				v-if='hasChildren( elem )'
			>
				<tree
					v-show='expandedState[displayLabel( elem )]'
					:elements='children( elem )'
					:fields='fields'
				></tree>
			</template>
		</div>
		
		<component is='style'>
			.tree
			{
				text-align: left;
			}
			.branch
			{
				margin-left: 20px;
				clear: both;
			}
			.link
			{
				cursor: pointer;
			}
			.one-line
			{
				float: left;
			}
			.collapsible
			{
				width: 10px;
			}
			.filler
			{
				height: 1px;
				width: 10px;
			}
		</component>
	</div>
	`,
	data: () => {
		return {
			prop_defaults: { elements: [], fields: {}, config: {} },
			expandedState: {},
			settings: {
				fields: {
					label: 'label',
					value: 'value',
					children: 'children',
					isChecked: 'isChecked'
				},
				config: {
					showExpander: true,
					showCheckbox: true,
					showParentCheckbox: true,
					expanded: true,
					openSymbol: '-',
					closedSymbol: '+',
					checked: false
				}
			}
		};
	},
	props:
	{
		elements: {
			type: Array
		},
		fields: {
			type: Object
		},
		config: {
			type: Object
		}
	},
	created()
	{
		for( const field of Object.keys( this.props.fields ) )
		{
			this.settings.fields[field] = this.props.fields[field];
		}
		
		for( const entry of Object.keys( this.props.config ) )
		{
			this.settings.config[entry] = this.props.config[entry];
		}
		
		for( const elem of this.props.elements )
		{
			if( !Object.keys( this.expandedState ).includes( this.displayLabel( elem ) ) )
			{
				this.$set( this.expandedState, this.displayLabel( elem ), this.settings.config.expanded );
			}
			
			if( !Object.keys( elem ).includes( this.settings.config.isChecked ) )
			{
				this.$set( elem, this.settings.fields.isChecked, this.settings.config.checked );
			}
		}
	},
	methods:
	{
		displayLabel( elem )
		{
			return elem[this.settings.fields.label] || '';
		},
		hasChildren( elem )
		{
			return !!this.children( elem );
		},
		children( elem )
		{
			return elem[this.settings.fields.children];
		},
		setExpansion( elem )
		{
			this.expandedState[this.displayLabel( elem )] = !this.expandedState[this.displayLabel( elem )];
		}
	},
	computed:
	{
		props()
		{
			let props = {};
			
			for( const key of Object.keys( this.$props ) )
			{
				props[key] = this.$props[key] || this.importProps[key] || this.prop_defaults[key];
			}
			
			return props;
		},
		importProps()
		{
			//userscript - import props here
			//() => { return { elements: {}, fields: {}, config: {} }; }
			return {};
		}
	}
};
