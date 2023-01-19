//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/editableRuleField.vue

<template>
	<div class='editable_rule_field'>

        <template v-if='isString'>
            <template v-if='isEditable'>
                <input type='text' v-model='localValue' />
                <img
                    class='icon'
                    :src='icon_check'
                    @click='dataChanged()'
                />
                <img
                    class='icon'
                    :src='icon_x'
                    @click='cancelEditing()'
                />
            </template>
            <template v-else>
                <input type='text' v-model='localValue' @change='dataChanged()' />
            </template>
        </template>

        <template v-else-if='isEnum'>
            <select v-model='localValue' @change='dataChanged()'>
                <option v-for='opt in type.values'
                    :key='opt'
                    :value='opt'
                >{{opt}}</option
            </select>
        </template>

        <template v-else-if='isRangeInteger'>
            <select v-model='localValue' @change='dataChanged()'>
                <option v-for='n in rangeIntegerValues'
                    :key='n'
                    :value='n'
                >{{n}}</option
            </select>
        </template>

        <template v-else>
            <label>{{localValue}}</label>
            <template v-if='isEditable'>
                <img
                    class='icon'
                    :src='icon_editPencilSmall'
                    @click='setEditing()'
                />
            </template>
        </template>

	</div>
</template>

<script>
	module.exports =
	{
		data: () => {
			return {
                fieldType: null,
                isEditing: false,
                localValue: null
            };
		},
		props:
		{
			type: { type: [Object, String], default: 'readonly' },
            rule: { type: Object, default: null },
            value: { type: [String, Number], required: true }
		},
		created()
		{
			this.fieldType = this.type;
            this.localValue = this.value;

            if( this.isRangeInteger && !this.rangeIntegerValues.includes( this.localValue ) )
            {
                this.localValue = this.fieldType.range.min;
            }
		},
		methods:
		{
			hasProp( field )
            {
                return Object.keys( this.type ).includes( field );
            },
            dataChanged()
            {
                this.$emit( 'changed', this.localValue );
                this.setEditing();
            },
            cancelEditing()
            {
                this.localValue = this.value;
                this.setEditing();
            },
            setEditing()
            {
                if( this.isEditable )
                {
                    this.isEditing = !this.isEditing;

                    if( this.isEditing )
                    {
                        this.fieldType = this.type.editType || 'string';
                    }
                    else
                    {
                        this.fieldType = this.type;
                    }
                }
            }
		},
		computed:
		{
            getType()
            {
                let type = isString( this.fieldType ) ? this.fieldType : this.fieldType.type;

                return type.trim().toLowerCase();
            },
            isEditable()
            {
                return this.type.editable || false;
            },
            isReadonly()
            {
                return 'readonly' == this.getType;
            },
            isString()
            {
                return 'string' == this.getType;
            },
            isEnum()
            {
                return 'enum' == this.getType;
            },
            isRangeInteger()
            {
                return 'integer' == this.getType && this.hasProp( 'range' );
            },
            rangeIntegerValues()
            {
                return [...Array( this.fieldType.range.max - this.fieldType.range.min + 1 ).keys()].map( n => n + this.fieldType.range.min );
            }
		}
	}
</script>

<style scoped>
	.editable_rule_field
    {
        display: inline-block;
    }
    .editable_rule_field input
    {
        width: calc(100% - 44px);
    }
    .icon
    {
        height: 16px;
        cursor: pointer;
        vertical-align: middle;
    }
</style>
