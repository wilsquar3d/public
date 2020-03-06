//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/menu.js
//requires utils.js

var global_defaults =
    {
        css:
        {
            //menu
            body: { padding: 0, margin: 0 },
            menuItems: { padding: '10px' },
            menu: { height: '100%', width: '200px', padding: 0, margin: 0, float: 'left' },
            display: { height: '100%', width: 'calc(100% - 202px)', padding: 0, margin: 0, 'border-left': '2px #000 solid', float: 'left' },
            //menuItem
            menuItem: { cursor: 'pointer', 'margin-bottom': '10px' },
            menuItemHover: { on: { 'background-color': '#CCC' }, off: { 'background-color': '#FFF' } },
            //jsonEditBox
            jsonEdit: { width: '50%', height: '50%', float: 'left' },
            jsonText: { width: '100%', height: 'calc(100% - 70px)', 'white-space': 'nowrap' },
            editBoxHover: { on: { 'background-color': '#EEE' }, off: { 'background-color': '#FFF' } },
            //isJson
            bgWhite: { 'background-color': '#FFF' },
            bgRed: { 'background-color': '#fbcfcf' }
        },
        json:
        {
            settings: { indent: '  ' }
        }
    };

function createMenu( menuItems=[], displayCSS=null, menuItemsCSS=null, menuCSS=null, bodyCSS=null )
{
    if( !displayCSS )
    {
        displayCSS = global_defaults.css.display;
    }

    if( !menuItemsCSS )
    {
        menuItemsCSS = global_defaults.css.menuItems;
    }

    if( !menuCSS )
    {
        menuCSS = global_defaults.css.menu;
    }

    if( !bodyCSS )
    {
        bodyCSS = global_defaults.css.body;
    }

    $( 'body' ).html( '' ).css( bodyCSS );
    $( 'body' ).append(
        [
            $( '<div id="menu" />' ).css( menuCSS ).append( $( '<div />' ).css( menuItemsCSS ).append( menuItems ) ),
            $( '<div id="display" />' ).css( displayCSS )
        ]
    );
}

//displayFunc will accept the selector to attach to
function menuItem( name, displayFunc, css=null, hover=null )
{
    if( !css )
    {
        css = global_defaults.css.menuItem;
    }

    if( !hover )
    {
        hover = global_defaults.css.menuItemHover;
    }

    return $( '<div />' )
        .css( css )
        .hover( function(){ $( this ).css( hover.on ); }, function(){ $( this ).css( hover.off ); } )
        .text( name )
        .click( function(){ $( '#display' ).html( '' ); displayFunc( '#display' ); } );
}

function jsonEditBoxGM( gmVar, cssJsonEdit=null, cssJsonText=null, jsonFormat=null, hover=null )
{
    if( !cssJsonEdit )
    {
        cssJsonEdit = global_defaults.css.jsonEdit;
    }

    if( !cssJsonText )
    {
        cssJsonText = global_defaults.css.jsonText;
    }

    if( !jsonFormat )
    {
        jsonFormat = global_defaults.json.settings;
    }

    if( !hover )
    {
        hover = global_defaults.css.editBoxHover;
    }

    var id = gmVar; //TODO should sanitize or randomize

    return $( '<div />' ).css( cssJsonEdit ).hover(
        function(){ $( this ).css( hover.on ); },
        function(){ $( this ).css( hover.off ); }
    ).append(
        [
            $( '<div style="padding:10px;" />' ).append(
                [
                    $( '<div style="height:20px;font-size:11pt" />' ).html( gmVar ),
                    $( '<textarea id="' + id + '" />' )
                        .css( cssJsonText )
                        .val( JSON.stringify( GM_getValue( gmVar, {} ), null, jsonFormat.indent ) )
                        .on( 'input', function(){ isJson( $( this ), global_defaults.css.bgWhite, global_defaults.css.bgRed, $( '#save_' + id ) ); } )
                ]
            ),
            $( '<input type="button" value="Save" id="save_' + id +  '" />' ).click(
                function()
                {
                    GM_setValue( gmVar, JSON.parse( $( '#' + id ).val() ) );
                }
            )
        ]
    );
}
