//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/download.js

// menuItems: list to add menu items to
function imagesViewAndDownload( menuItems, viewTitleFunc=null, downloadTitleFunc=null )
{
    let gmKeys = GM_listValues();

    for( const key of gmKeys )
    {
        let tempData = GM_getValue( key, null );

        if( tempData )
        {
            menuItems.push( menuItem( viewTitleFunc( key ), { func: imagesDownloadPage, props: { key: key, title: key } } ) );
            menuItems.push( menuItem( downloadTitleFunc( key ), { func: imagesDownloadPage, props: { key: key, title: key, showAll: 10 } } ) );
        }
    }
}

// props: { key: <gm data id>, title: <optional>, showAll: <optional true|number>, addExt: <optional true|false>, nameKey: <optional string>, imgKey: <optional string> }
function imagesDownloadPage( id, props )
{
    let tempData = GM_getValue( props.key, {} );
    let dlData = Object.keys( tempData ).reduce( (acc, key) => { acc[props.nameKey ? tempData[key][nameKey] : key] = tempData[key][props.imgKey || 'image']; return acc; }, {} ); // name: image url

    display_imagesDownloadPage( id, dlData, props.title || id, props.showAll || true, props.addExt || false );
}

// Can show a limited number of images (#), all (true) or none (false)
function display_imagesDownloadPage( id, imgs, name, showImgs=true, addExt=true, type='image/png' )
{
    let keys = Object.keys( imgs );

    $( id )
        .append( $( '<div style="font-size:24pt;padding:10px;margin:20px;background-color:lightgrey;">' + name + ' (' + keys.length + ')</div>' )
            .append( $( '<input type="button" value="Download All" style="margin-left: 10px;" />' ).click( function(){ downloadAll( imgs, type, addExt ); } ) ) );

    if( showImgs )
    {
        let limit = parseInt( showImgs ) || keys.length;
        let cnt = 0;

        $.each( keys,
            function( ndx, key )
            {
                $( id ).append( '<img style="max-height:100px;" title="' + key + '" src="' + imgs[key] + '" />' );

                if( ++cnt == limit )
                {
                    return false;
                }
            }
        );
    }
}

function downloadAll( elems, type='image/png', addExt=true, tout=0, inter=300 )
{
    let timeout = tout;
    let interval = inter;

    $.each( Object.keys( elems ),
        function( ndx, name )
        {
            let url = elems[name];

            if( addExt )
            {
                name += '.' + url.split( '?' )[0].split( '#' )[0].split( '.' ).pop();
            }

            setTimeout( autoDownload, timeout, name, url, type );

            timeout += interval;
        }
    );
}

function autoDownload( filename, url, type='image/png' )
{
    GM_xmlhttpRequest(
        {
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function( response )
            {
                if( 200 == response.status )
                {
                    var data = new Blob( [new Uint8Array( response.responseText.split( '' ).map( ch => ch.charCodeAt( 0 ) ) )], { type: type } );
                    var fileURL = window.URL.createObjectURL( data );

                    const link = document.createElement( 'a' );
                    link.href = fileURL;
                    link.setAttribute( 'download', filename );
                    document.body.appendChild( link );
                    link.click();
                    link.remove();

                    window.URL.revokeObjectURL( fileURL );
                }
                else
                {
                    console.log( response );
                }
            }
        }
    );
}
