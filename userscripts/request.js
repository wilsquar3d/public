//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/request.js
//userscript must grant: GM_xmlhttpRequest


//request: JSON request matching structure created by buildRequest
//callback (optional): the function to call with the response
//args (optional): anything you want passed to the callback method
//returns a promise
function httpRequest( request, callback, ...args )
{
    return new Promise( ( resolve, reject ) =>
        {
            request.onload = ( response ) =>
                {
                    if( callback )
                    {
                        callback( response, ...args );
                    }

                    if( 200 == response.status )
                    {
                        resolve( response );
                    }

                    reject( response );
                };

            request.onerror = ( response ) =>
                {
                    if( callback )
                    {
                        httpRequestError( response, ...args );
                    }

                    reject( response );
                }

            GM_xmlhttpRequest( request );
        }
    );
}

//method: GET, POST, PUT, etc.
//headers: headers object
//payload: message data
//responseType: document, text, arraybuffer, etc.
function buildRequest( url, method, headers, payload, responseType )
{
    return {
        method: method,
        url: url,
        headers: headers,
        data: JSON.stringify( payload ),
        responseType: responseType
    }
}

//automatic 200 validation: ex. httpRequest( buildRequest( url, method, headers, payload, responseType ), validateHttpRequest, callback_func, <other args> );
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
