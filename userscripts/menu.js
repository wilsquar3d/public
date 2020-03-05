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
            editBoxHover: { on: { 'background-color': '#EEE' }, off: { 'background-color': '#FFF' } }
        },
        json:
        {
            settings: { indent: '  ' }
        }
    };
/*
function createMenu( menuItems=[], displayCSS={}, menuItemsCSS={}, menuCSS={}, bodyCSS={} )
{
    $( 'body' ).html( '' ).css( bodyCSS );
    $( 'body' ).append(
        [
            $( '<div id="menu" />' ).css( menuCSS ).append( $( '<div />' ).css( menuItemsCSS ).append( menuItems ) ),
            $( '<div id="display" />' ).css( displayCSS )
        ]
    );
}

//displayFunc will accept the selector to attach to
function menuItem( name, displayFunc, css={}, hover={} )
{
    return $( '<div />' )
        .css( css )
        .hover( function(){ $( this ).css( hover.on ); }, function(){ $( this ).css( hover.off ); } )
        .text( name )
        .click( function(){ $( '#display' ).html( '' ); displayFunc( '#display' ); } );
}

function jsonEditBoxGM( gmVar, jsonFormat={}, hover={} )
{
    var id = gmVar; //TODO should sanitize or randomize

    return $( '<div style="width:50%;height:50%;float:left;" />' ).hover(
        function(){ $( this ).css( hover.on ); },
        function(){ $( this ).css( hover.off ); }
    ).append(
        [
            $( '<div style="padding:10px;" />' ).append(
                $( '<textarea id="' + id + '" style="width:100%;height:calc(100% - 50px);white-space:nowrap;" />' )
                    .val( JSON.stringify( GM_getValue( gmVar, {} ), null, jsonFormat.indent ) )
                    .on( 'input', function(){ isJson( $( this ), { 'background-color': '#FFF' }, { 'background-color': '#fbcfcf' }, $( '#save_' + id ) ); } )
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
*/
