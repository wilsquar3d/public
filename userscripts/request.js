//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/request.js

//method: GET, POST, PUT, etc.
//responseType: document, etc.
//passthrough is anything you want passed to the result methods
function request( url, method, responseType, func200, funcOther, passthrough )
{
    GM_xmlhttpRequest(
        {
            method: method,
            url: url,
            responseType: responseType,
            onload: function( response )
            {
                if( 200 == response.status )
                {
                    func200( response, passthrough );
                }
                else
                {
                    funcOther( response, passthrough );
                }
            }
        });
}

function log( data, passthrough )
{
    console.log( 'passthrough' );
    console.log( passthrough );
    console.log( 'data' );
    console.log( data );
}
