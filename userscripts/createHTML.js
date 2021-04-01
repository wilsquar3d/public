//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/createHTML.js
//requires utils.js

/*
Example Usage:

var list = [
    { tag: 'input', label: 'name', value: 'text value' },
    { tag: 'br' },
    { tag: 'input', label: 'name', value: 'text value', readonly: true },
    { tag: 'br' },
    { tag: 'input', label: 'name', value: 'text value', disabled: true },
    { tag: 'br' },
    { tag: 'textarea', label: 'name', value: 'text value'},
    { tag: 'br' },
    { tag: 'input', type: 'radio', label: 'name1', name: 'group' },
    { tag: 'br' },
    { tag: 'input', type: 'radio', label: 'name2', name: 'group' },
    { tag: 'br' },
    { tag: 'input', type: 'radio', label: 'name3', name: 'group' },
    { tag: 'br' },
    { tag: 'select', label: 'select label', value: 'val1', options: [{ value: 'val1'}, { value: 'val2' }] },
    { tag: 'br' },
    { tag: 'input', type: 'checkbox', label: 'check1' },
    { tag: 'br' },
    { tag: 'input', type: 'checkbox', label: 'check2' }
];

$( <selction> ).append( buildTags( list ) );
*/


//Builds a list of tags from object definitions
//list: [{}, ...]
function buildTags( list )
{
    if( !Array.isArray( list ) )
    {
        console.log( 'Tags list not defined as an array: ' + JSON.stringify( list ) );
        return [];
    }

    let tags = [];

    $.each( list, function( ndx, val )
        {
            if( !isObject( val ) )
            {
                console.log( 'Tag not defined as an object: ' + JSON.stringify( val ) );
                return;
            }

            switch( val.tag )
            {
                case 'input':
                case 'textarea':
                    tags = tags.concat( buildInput( val ) );
                    break;

                case 'select':
                    tags = tags.concat( buildSelect( val ) );
                    break;

                case 'br':
                    tags.push( $( '<br />' ) );
                    break;

                default:
                    console.log( 'Uknown tag type: ' + JSON.stringify( val ) );
            }
        }
    );

    return tags;
}

//Builds an input tag
//props: { tag: 'textarea', label: '', value: '' }, { tag: 'input', type: 'text|radio|checkbox', label: '', name: '' },
function buildInput( props )
{
    let label = props.label || '';
    let isSuffixLabel = ['radio', 'checkbox'].includes( props.type );
    let tags = [];

    if( label && !isSuffixLabel )
    {
        tags.push( $( '<label />' ).html( label + ': ' ) );
    }

    props.type = props.type || 'text';

    let input = $( '<' + props.tag + ' />' ).val( props.value || props.label || '' );

    delete props.tag;
    delete props.label;
    delete props.value;

    addTagProps( input, props );
    tags.push( input );


    if( label && isSuffixLabel )
    {
        tags.push( $( '<label />' ).html( label ) );
    }

    return tags;
}

//Builds a select tag
//props: { tag: 'select', label: '', value: '', options: [{ value: ''}, { value: '' }] }
function buildSelect( props )
{
    let label = props.label || '';
    let tags = [];

    if( label )
    {
        tags.push( $( '<label />' ).html( label + ': ' ) );
    }

    let select = $( '<select />' )
        .append( function()
            {
                let options = [];

                $.each( props.options, function( ndx, option_props )
                    {
                        let option = $( '<option />' ).html( option_props.label || option_props.value );
                        delete option_props.label;
                        addTagProps( option, option_props );
                        options.push( option );
                    }
                );

                return options;
            }
        )
        .val( props.value );

    delete props.tag;
    delete props.label;
    delete props.value;
    delete props.options;

    addTagProps( select, props );
    tags.push( select );

    return tags;
}

//Assigns all object properties to the tag as key='value'
function addTagProps( tag, props )
{
    $.each( Object.keys( props ), function( ndx, val )
        {
            tag.attr( val, props[val] );
        }
    );

    return tag;
}
