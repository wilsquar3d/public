//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/createHTML.js
//requires utils.js

/*
Example Usage:

var globals = {
    input: { class: 'class_input', value: 'some text value' },
    a: { text: 'link text' },
    label: { class: 'class_label' }
};

var list = [
    { tag: 'input', id: 'input1', label: 'name' },
    { tag: 'br' },
    { tag: 'input', label: 'name', value: 'text value', readonly: true },
    { tag: 'br' },
    { tag: 'input', label: 'name', value: 'text value', disabled: true },
    { tag: 'br' },
    { tag: 'textarea', label: 'name', value: 'text value'},
    { tag: 'br' },
    { tag: 'input', type: 'radio', label: 'name1', name: 'group' },
    { tag: 'br' },
    { tag: 'input', type: 'radio', label: 'name2', name: 'group', checked: true },
    { tag: 'br' },
    { tag: 'input', type: 'radio', label: 'name3', name: 'group' },
    { tag: 'br' },
    { tag: 'select', label: 'select label', value: 'val1', options: [{ value: 'val1'}, { value: 'val2' }] },
    { tag: 'br' },
    { tag: 'input', type: 'checkbox', label: 'check1' },
    { tag: 'br' },
    { tag: 'input', type: 'checkbox', label: 'check2' },
    { tag: 'div', html: 'div content' },
    { tag: 'label', text: 'label text' },
    { tag: 'br' },
    { tag: 'a', href: 'https://google.com' }
];

$( <selector> ).append( buildTags( list ) );
*/


//Builds a list of tags from object definitions
//tag properties override global properties
//list: [{}, ...]
function buildTags( list, globals={} )
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
                    tags = tags.concat( buildInput( val, globals ) );
                    break;

                case 'select':
                    tags = tags.concat( buildSelect( val, globals ) );
                    break;

                default:
                    tags = tags.concat( buildGeneric( val, globals ) );
                    break;
            }
        }
    );

    return tags;
}

//Builds an input tag
//props: { tag: 'textarea', label: '', value: '' }, { tag: 'input', type: 'text|radio|checkbox', label: '', name: '' },
function buildInput( props, globals={} )
{
    let label = props.label || '';
    let isSuffixLabel = ['radio', 'checkbox'].includes( props.type );
    let tags = [];

    if( label )
    {
        label = buildLabel( label, props, globals );
    }

    if( label && !isSuffixLabel )
    {
        tags.push( label );
    }

    props.type = props.type || 'text';

    let input = $( '<' + props.tag + ' />' );
    addGlobalProps( input, props, globals );

    delete props.tag;

    addSpecialTagProps( input, props );
    addTagProps( input, props );
    tags.push( input );

    if( label && isSuffixLabel )
    {
        tags.push( label );
    }

    return tags;
}

//Builds a select tag
//props: { tag: 'select', label: '', value: '', options: [{ value: ''}, { value: '' }] }
function buildSelect( props, globals={} )
{
    let label = props.label || '';
    let tags = [];

    if( label )
    {
        tags.push( buildLabel( label, props, globals ) );
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
        );

    addGlobalProps( select, props, globals );

    delete props.tag;
    delete props.options;

    addSpecialTagProps( select, props );
    addTagProps( select, props );
    tags.push( select );

    return tags;
}

function buildGeneric( props, globals={} )
{
    let tag = $( '<' + props.tag + ' />' );
    addGlobalProps( tag, props, globals );

    delete props.tag;

    addSpecialTagProps( tag, props );
    addTagProps( tag, props );

    return tag;
}

function buildLabel( label, props, globals={} )
{
    let tag = $( '<label />' ).html( label + ': ' );

    if( Object.keys( props ).includes( 'id' ) )
    {
        tag.attr( 'id', props.id + '_label' );
    }
    delete props.label;

    addGlobalProps( tag, { tag: 'label' }, globals );

    return tag;
}

function addGlobalProps( tag, props, globals={} )
{
    if( Object.keys( globals ).includes( props.tag ) )
    {
        let global_props = copyObject( globals[props.tag] );

        addSpecialTagProps( tag, global_props );

        $.each( Object.keys( global_props ), function( ndx, val )
            {
                tag.attr( val, global_props[val] );
            }
        );
    }
}

function addSpecialTagProps( tag, props )
{
    if( Object.keys( props ).includes( 'value' ) )
    {
        tag.val( props.value );
    }
    delete props.value;

    if( Object.keys( props ).includes( 'html' ) )
    {
        tag.html( props.html );
    }
    delete props.html;

    if( Object.keys( props ).includes( 'text' ) )
    {
        tag.text( props.text );
    }
    delete props.text;

    return tag;
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
