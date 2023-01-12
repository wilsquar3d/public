//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/startup.js
// @require      https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/execControl.js
// @require      https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/utils.js
/*
startup.init( 'appID_name' );

startup.registerHandler( ['blanksite.com', '?menu_page_name'], loadDisplay );
startup.registerHandler( 'data_page.com', dataPageFunc );
startup.registerHandler( function(){ return true; }, dataPageFunc );

startup.run();
*/

var startup = {
    siteURL: null,
    appID: null,
    settings: {},
    handlers: [],

    // initialize siteURL, appID and startup default return value
    init: function( id, ret=false )
    {
        this.siteURL = window.location.href;
        this.appID = id;

        this.registerSettings( ret );
    },

    // register settings (default return value)
    registerSettings: function( ret=false )
    {
        this.settings = {
            ret: ret
        };
    },

    // add a siteURL handler if the includes are matched, calls func and returns the expected value.
    registerHandler: function( match, func, useFuncRet=false, hasRet=true, ret=true )
    {
        let isFunc = isFunction( match ) || ( Array.isArray( match ) && match.length && isFunction( match[0] ) );

        this.handlers.push( {
            includes: isFunc ? null : Array.isArray( match ) ? match : [match],
            match: isFunc ? Array.isArray( match ) ? match : [match] : null,
            func: func,
            useFuncRet: useFuncRet,
            hasRet: hasRet,
            ret: ret
        } );
    },

    // default startup function using registered handlers and settings
    // startup not this to allow running in any scope, as function ref, etc.
    startupHandler: () =>
    {
        for( const handler of startup.handlers )
        {
            let matchResult = handler.includes
                ? handler.includes.reduce( (r, x) => r && startup.siteURL.includes( x ), true )
                : handler.match.reduce( (r, x) => r && x(), true );

            if( matchResult )
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
    run: function( func=null )
    {
        runFunc( func || this.startupHandler );
    }
};
