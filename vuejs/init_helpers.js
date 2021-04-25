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

//menu_items: an array of menu items loaded as data and passed to the menu components as a prop { name: <menu item name>, component: <component name> }
//default_item: is the name of a menu_items component to be initially selected
//file_components: an array of components { name: <component name>, source: <component source> }
//local_components: an array of components { name: <component name>, component: { template: <template>, methods: <methods>, computed: <computed>, ... } }
function vuejs_menu( menu_items, default_item='', file_components=[], local_components=[] )
{
    let load = {
        template: '<menu-component :menu_items="menu_items", :default_item="default_item"></menu-component>',
        data:
        {
            menu_items: menu_items,
            default_item: default_item
        },
        components: { 'menu-component': 'https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/menu/menu.vue' }
    };

    vuejs_init( load );

    //Load locally defined components
    file_components.map( file_component => { Vue.component( file_component.name, httpVueLoader( file_component.source ) ); } );

    //Load external <component>.vue components
    local_components.map( local_component => { Vue.component( local_component.name, local_component.component );  } );

    //Ensure all menu components loaded and attempt to load missing external <components>.vue.js components
    for( const menu_item of menu_items )
    {
        if( !Vue.options.components[menu_item.component] )
        {
            if( components[menu_item.component] )
            {
                Vue.component( menu_item.component, components[menu_item.component] );
            }
            else
            {
                console.error( 'Missing component: "' + menu_item.component + '"' );
            }
        }
    }
}
