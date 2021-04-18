//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/init_helpers.js
//requires utils.js

//load: can be the source of a main component or an object containing a template, data and components list { template: '', data: { 'name': 'value' }, components: { 'tag-name': 'component-source' } }
function vuejs_init( load )
{
    let template = '<div id="vue-app">' + ( load.template || '<vuejs-host-component></vuejs-host-component>' ) + '</div>';
    let data = {};
    let components = {};

    //load components with a template
    if( isObject( load.components ) )
    {
        $.each( Object.keys( load.components ), function( ndx, val )
            {
                components[val] = httpVueLoader( load.components[val] );
            }
        );
        
        if( load.data )
        {
            data = load.data;
        }
    }
    //load a default hosting component
    else if( isString( load ) )
    {
        components = { 'vuejs-host-component': httpVueLoader( load ) };
    }

    let vuejsapp = new Vue(
        {
            data: data,
            components: components
        }
    );

    window.jQuery = $.noConflict( true );
    jQuery( 'body' ).html( '' ).css( { padding: 0, margin: 0 } ).append( template );
    vuejsapp.$mount( '#vue-app' );
}
