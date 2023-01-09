//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/startup.js
// @require      https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/execControl.js
/*
startup.init( 'appID_name' );

startup.registerHandler( ['blanksite.com', '?menu_page_name'], menuPageFunc );
startup.registerHandler( 'data_page.com', dataPageFunc );

startup.run();
*/

var startup = {
    siteURL: null,
    appID: null,
    settings: {},
    handlers: [],

    // initialize siteURL, appID and startup default return value
    init: ( id, ret=false ) =>
    {
        startup.siteURL = window.location.href;
        startup.appID = id;

        startup.registerSettings( ret );
    },

    // register settings (default return value)
    registerSettings: ( ret=false ) =>
    {
        startup.settings = {
            ret: ret
        };
    },

    // add a siteURL handler if the includes are matched, calls func and returns the expected value.
    registerHandler: ( includes, func, useFuncRet=false, hasRet=true, ret=true ) =>
    {
        startup.handlers.push( {
            includes: Array.isArray( includes ) ? includes : [includes],
            func: func,
            useFuncRet: useFuncRet,
            hasRet: hasRet,
            ret: ret
        } );
    },

    // default startup function using registered handlers and settings
    startupHandler: () =>
    {
        for( const handler of startup.handlers )
        {
            if( handler.includes.reduce( (r, x) => r && startup.siteURL.includes( x ), true ) )
            {
                let ret = handler.func();

                if( handler.useFuncRet )
                {
                    return ret;
                }

                if( handler.hasRet )
                {
                    return handler.ret;
                }
            }
        }

        return startup.settings.ret;
    },

    // runFunc
    run: ( func=null ) =>
    {
        runFunc( func || startup.startupHandler );
    }
};
