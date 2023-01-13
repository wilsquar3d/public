//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/startup.js
// @require      https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/execControl.js
// @require      https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/utils.js
/*
startup.init( 'appID_name' );

// any combination of the following is supported
startup.registerHandler( ['blanksite.com', '?menu_page_name'], loadDisplay ); // array siteURL includes
startup.registerHandler( 'data_page.com', dataPageFunc ); // single siteURL includes
startup.registerHandler( function(){ return true; }, dataPageFunc ); // function condition
startup.registerHandler( ['somesite.com', () => true], loadDisplay ); // array siteURL include and function condition
startup.registerHandler( 'includes', null, bindFunc ); // no include/condition function with binding function
startup.registerHandler( 'includes', matchFunc, { dom: 'body', action: 'DOMSubtreeModified', func: bindFunc } ); // include/condition with a match function and full custom binding

startup.run();

// TODO support includes and functions in match
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

    // add a handler if [match] are string(s) included in siteURL or function(s) that all return true, then calls func and returns the output (useFuncRet=true), the default (ret, if hasRet=true) or no value.
    // bind adds a DOM change handler. Can supply just handler function for default body/change handler or full params object
    registerHandler: function( match, func, bind=null, useFuncRet=false, hasRet=true, ret=true )
    {
        // force match to be an array
        if( !Array.isArray( match ) )
        {
            match = [match];
        }

        let matchFuncs = [];
        let includes = [];

        for( const m of match )
        {
            if( m )
            {
                if( isFunction( m ) )
                {
                    matchFuncs.push( m );
                }
                else
                {
                    includes.push( m );
                }
            }
        }

        // Only bind handler function supplied
        if( bind && isFunction( bind ) )
        {
            bind = { dom: 'body', action: 'DOMSubtreeModified', func: bind };
        }

        this.handlers.push( {
            includes: includes,
            match: matchFuncs,
            func: func,
            bind: bind,
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
            let matchResult = handler.includes.reduce( (r, x) => r && startup.siteURL.includes( x ), true ) &&
                handler.match.reduce( (r, x) => r && x(), true );

            if( matchResult )
            {
                let ret = handler.func ? handler.func() : false;

                if( handler.bind )
                {
                    $( handler.bind.dom ).bind( handler.bind.action, handler.bind.func );
                }

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
