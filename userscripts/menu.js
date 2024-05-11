//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/menu.js
//requires utils.js

unsafeWindow.gm_version = unsafeWindow.gm_version || {};
unsafeWindow.gm_version.menu = { "version": "1.1.2", "source": "https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/menu.js" };

var global_defaults =
    {
        css:
        {
            //menu
            body: { padding: 0, margin: 0 },
            menuItems: { padding: '10px' },
            menu: { height: '100%', width: '200px', padding: 0, margin: 0, float: 'left', 'overflow-y': 'scroll' },
            display: { height: '100%', width: 'calc(100% - 202px)', padding: 0, margin: 0, 'border-left': '2px #000 solid', float: 'left', overflow: 'auto' },
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

function createMenu( menuItems=[], props={ startPage: null } )
{
    createMenuHelper( menuItems, props );

    let pageParts = window.location.href.split( 'startPage=' );

    if( pageParts.length > 1 )
    {
        $( '#' + createSafeID( decodeURI( pageParts[1].split( '&' )[0] ) ) ).click();
    }
    else if( props.startPage )
    {
        $( '#' + createSafeID( props.startPage ) ).click();
    }
    else
    {
        $( '#' + createSafeID( menuItems[0].text() ) ).click();
    }
}

function createMenuHelper( menuItems=[], props={ displayCSS: null, menuItemsCSS: null, menuCSS: null, bodyCSS: null } )
{
    let displayCSS = props.displayCSS || global_defaults.css.display;
    let menuItemsCSS = props.menuItemsCSS || global_defaults.css.menuItems;
    let menuCSS = props.menuCSS || global_defaults.css.menu;
    let bodyCSS = props.bodyCSS || global_defaults.css.body;

    $( 'body' ).html( '' ).css( bodyCSS );
    $( 'body' ).append(
        [
            $( '<div id="menu" />' ).css( menuCSS ).append( $( '<div />' ).css( menuItemsCSS ).append( menuItems ) ),
            $( '<div id="display" />' ).css( displayCSS )
        ]
    );
}

//displayFunc will accept the selector to attach to
//displayFunc can be a function() or object { func: function(), props: [props]]
function menuItem( name, displayFunc, props={ css: null, hover: null } )
{
    let css = props.css || global_defaults.css.menuItem;
    let hover = props.hover || global_defaults.css.menuItemHover;

    let func = displayFunc;
    let funcProps = [];
    if( isObject( displayFunc ) )
    {
        funcProps = Array.isArray( displayFunc.props ) ? displayFunc.props : [displayFunc.props];
        func = displayFunc.func;
    }

    return $( '<div />' )
        .css( css )
        .hover( function(){ $( this ).css( hover.on ); }, function(){ $( this ).css( hover.off ); } )
        .text( name )
        .attr( 'id', createSafeID( name ) )
        .click(
            function()
            {
                $( '#display' ).html( '' );

                if( displayFunc.obj )
                {
                    displayFunc.obj[func || 'display']( '#display', ...funcProps );
                }
                else
                {
                    func( '#display', ...funcProps );
                }
            } );
}

function jsonEditBoxGM( gmVar, props={ cssJsonEdit: null, cssJsonText: null, jsonFormat: null, hover: null } )
{
    let cssJsonEdit = props.cssJsonEdit || global_defaults.css.jsonEdit;
    let cssJsonText = props.cssJsonText || global_defaults.css.jsonText;
    let jsonFormat = props.jsonFormat || global_defaults.json.settings;
    let hover = props.hover || global_defaults.css.editBoxHover;
    let id = gmVar; //TODO should sanitize or randomize

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
