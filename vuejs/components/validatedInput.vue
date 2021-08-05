//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/validatedInput.vue

<template>
	<div class='validatedInput'>
		<template v-if='label && label_first'>
			<label>{{label}}</label>
		</template>
		<input
			type='text'
			:placeholder='placeholder'
			:class='isValid ? valid_class : error_class'
			v-model='modelValue'
			@keyup='onChange'
		/>
		<template v-if='label && !label_first'>
			<label>{{label}}</label>
		</template>
	</div>
</template>

<script>
	module.exports =
	{
		data: () => {
			return {
				isValid: true,
				regex: null,
				valid_func: null
			};
		},
		props:
		{
			label: { type: String, default: null },
			label_first: { type: Boolean, default: true },
			value: { type: [Number, String], default: '' },
			placeholder: { type: String, default: '' },
			
			validate_func: { type: Function, default: null },
			regex_pattern: { type: String, default: null },
			validate_type: { type: String, default: null },
			empty: { type: Boolean, default: true },
			allow_invalid: { type: Boolean, default: false },
			
			valid_class: { type: String, default: 'valid_default' },
			error_class: { type: String, default: 'error' }
		},
		created()
		{
			if( this.regex_pattern )
			{
				this.regex = new RegExp( this.regex_pattern );
			}
			
			if( this.validate_func )
			{
				this.valid_func = this.validate_func;
			}
			
			if( this.validate_type )
			{
				switch( this.validate_type )
				{
					case 'Numbers':
						this.valid_func = this.isNumeric;
						break;
						
					case 'PositiveNumbers':
						this.valid_func = function( val ){ return this.isNumeric( val ) && val > 0; };
						break;
						
					case 'NegativeNumbers':
						this.valid_func = function( val ){ return this.isNumeric( val ) && val < 0; };
						break;
						
					default:
						console.log( 'Invalid validation type "' + this.validate_type + '"' );
				}
			}
			
			this.modelValue = this.value;
			this.onChange();
		},
		methods:
		{
			emit( evt, val, state )
			{
				this.$emit( evt, val, state );
				this.$emit( 'emit', evt, val, state );
			},
			isNumeric( val )
			{
				return !isNaN( val );
			},
			isValidValue( val )
			{
				val = val.toString();
				
				if( '' === val.trim() )
				{
					this.isValid = this.empty;
				}
				else if( this.valid_func )
				{
					this.isValid = this.valid_func( val );
				}
				else if( this.regex )
				{
					this.isValid = this.regex.test( val );
				}
				
				return this.isValid;
			},
			onChange()
			{
				this.isValidValue( this.value );
			}
		},
		computed:
		{
			modelValue:
			{
				get()
				{
					return this.value;
				},
				set( val )
				{
					//model is updated before change event is called
					let isValid = this.isValidValue( val );
					let evt = ( this.allow_invalid || isValid ) ? 'input' : 'invalid';
					
					this.emit( evt, val, isValid );
				}
			}
		}
	}
</script>

<style>
	.validatedInput
	{
		display: inline-block;
	}
	.error
	{
		color: #FFF;
		background-color: red;
	}
	.error_frame
	{
		border: 1px solid #000;
	}
	.valid_green
	{
		color: #000;
		background-color: lightgreen;
	}
	.valid_default
	{
	}
</style>
