

function createID( appID, varName, extras=[] )
{
    return 'ww_' + appID + '_' + varName + ( extras && extras.length > 0 ? ( '_' + extras.join( '_' ) ) : '' ) + '_ww';
}

function createSafeID( id )
{
    return id.replace( /[\W_]+/g, '_' ).toLowerCase();
}

function isJson( text )
{
    try
    {
        JSON.parse( text );
        return true;
    }
    catch( e )
    {
        return false;
    }
}

function isJsonAction( elem, pos, neg, btn=null )
{
    var test = isJson( elem.val() );

    elem.css( test ? pos : neg );

    if( btn )
    {
        btn.attr( 'disabled', !test );
    }

    return test;
}

function isObject( val )
{
    return val === Object( val ) && !Array.isArray( val ) && typeof val != 'function';
}

function isFunction( val )
{
    return val === Object( val ) && !Array.isArray( val ) && typeof val === 'function';
}

function isPrimitive( val )
{
    return val && val !== Object( val );
}

function isNumber( val )
{
    return isPrimitive( val ) && !isNaN( val );
}

function isString( val )
{
    return isPrimitive( val ) && !isNumber( val );
}

function copyJson( json )
{
    return JSON.parse( JSON.stringify( json ) );
}

function guid( bFullRandom=false )
{
    let rand = Date.now().toString( 16 ) + Math.random().toString( 16 ).replace( '.', '' ) + Math.random().toString( 16 ).replace( '.', '' );

    return [rand.substr( 0, 8 ), rand.substr( 8, 4 ), bFullRandom ? rand.substr( 12, 4 ) : '7777', rand.substr( 16, 4 ), rand.substr( 20, 12 )].join( '-' );
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

//Clear all stored variables except exclusions
function clearAllData( exclusions=[] )
{
    $.each( GM_listValues(),
        function( ndx, key )
        {
            if( !exclusions.includes( key ) )
            {
                GM_deleteValue( key );
            }
        });

}
