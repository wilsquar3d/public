//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/requestIntercept.js

function intercept_requestHeaders( propName='headers_store', func=null )
{
    (function( setRequestHeader ) {
        XMLHttpRequest.prototype.setRequestHeader = function() {
            //store header on the request
            if( propName )
            {
                if( !Object.keys( this ).includes( propName ) )
                {
                    this[propName] = {};
                }

                this[propName][arguments[0]] = arguments[1];
            }

            //notify on each header
            if( func )
            {
                func( this, arguments );
            }

            setRequestHeader.apply( this, arguments );
        };
    } )(XMLHttpRequest.prototype.setRequestHeader);
}

//can combine with intercept_requestHeaders to include a copy of all headers of the request
function intercept_requests( func, propName='headers_store' )
{
    func = func || intecept_default;

    (function( send ) {
        XMLHttpRequest.prototype.send = function() {
            func( this );

            if( propname && Object.keys( this ).includes( propName ) )
            {
                delete this[propName];
            }

            send.apply( this, arguments );
        };
    } )(XMLHttpRequest.prototype.send);
}

function intercept_responses( funcSuccess, funcFailure, eventListener='readystatechange' )
{
    funcSuccess = funcSuccess || intercept_default;

    (function( open ) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener( eventListener, function() {
                //ready and status is 2##
                if( 4 == this.readyState && this.status - 200 < 100 )
                {
                    funcSuccess( this );
                }
                else if( funcFailure )
                {
                    funcFailure( this );
                }
            }, false );

            open.apply( this, arguments );
        };
    } )(XMLHttpRequest.prototype.open);
}

function intercept_default( request, ...args )
{
    console.log( request );
    console.log( args );
}
