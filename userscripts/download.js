//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/download.js

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
