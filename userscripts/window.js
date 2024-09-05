// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/window.js

function loadWindowAndClose( url, maxRetries=10, interval=500 )
{
    return new Promise(
        function( resolve, reject )
        {
            let retries = maxRetries;
            let win = window.open( url );

            const id = setInterval( () => {
                if( win.window.length )
                {
                    win.close();
                }

                if( win.closed )
                {
                    clearInterval( id );
                    resolve();
                }

                if( --retries <= 0 )
                {
                    reject( `Maximum number of retries '${maxRetries}' exceeded!` );
                }
            }, interval );
        }
    );
}
