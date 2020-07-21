//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/utils.js

function createID( appID, varName, extras=[] )
{
    return 'ww_' + appID + '_' + varName + ( extras && extras.length > 0 ? ( '_' + extras.join( '_' ) ) : '' ) + '_ww';
}

function createSafeID( id )
{
    return id.replace( /[\W_]+/g, '_' ).toLowerCase();
}

function isJson( elem, pos, neg, btn=null )
{
    var test = false;

    try
    {
        JSON.parse( elem.val() );
        test = true;
    }
    catch( e ) {}

    elem.css( test ? pos : neg );

    if( btn )
    {
        btn.attr( 'disabled', !test );
    }

    return test;
}

//Replace ${var} with vars[var]
function varReplace( txt, vars )
{
    $.each( Object.keys( vars ),
        function( ndx, val )
        {
            txt = txt.split( '${' + val + '}' ).join( vars[val] );
        }
    );

    return txt;
}
