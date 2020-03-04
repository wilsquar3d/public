//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/debug.js

function debugGM( attach, settings={ isJson: true, style: 'width:100%;height:100%;white-space:nowrap;' } )
{
    var data = {};
    $.each( GM_listValues(), function( ndx, key ){ let json = GM_getValue( key, null ); if( json ){ data[key] = json } } );
    debug( data, attach, settings );
}

function debug( data, attach, settings={ isJson: true, style: 'width:100%;height:100%;white-space:nowrap;' } )
{
    $( '<textarea style="' + settings.style + '"/>' )
        .val( ( settings.isJson ? JSON.stringify( data, null, '\t' ) : debugData ) )
        .appendTo( attach );
}
