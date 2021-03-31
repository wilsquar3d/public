//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/request.js
//userscript must grant: GM_xmlhttpRequest

function httpRequest( url, method, callback, ...args )
{
    httpRequestFull( url, method, {}, '', callback, ...args );
}

//method: GET, POST, PUT, etc.
//headers: headers object
//responseType: document, text, arraybuffer, etc.
//callback: the function to call with the response
//args: anything you want passed to the result methods
function httpRequestFull( url, method, headers, responseType, callback, ...args )
{
    GM_xmlhttpRequest(
        {
            method: method,
            url: url,
            headers: headers,
            responseType: responseType,
            onload: function( response )
            {
                callback( response, ...args );
            }
        });
}

//automatic 200 validation: ex. httpRequest( url, method, validateHttpRequest, callback_func, <other args> );
function validateHttpRequest( response, callback, ...args )
{
    if( 200 == response.status )
    {
        callback( response, ...args );
    }
    else
    {
        httpRequestError( response, ...args );
    }
}

function httpRequestError( response, ...args )
{
    console.log( 'httpRequestError' );
    console.log( response );
    console.log( args );
}
