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

/*
gmData.setAutoReload( false );
gmData.set( { a: [1,2,3,4,5], b: { c: 'C', d: 'D', e: { f: 7 } } } );
gmData.setSub( 'dddd', 'b', 'd' );
gmData.setSub( { g: 6, h: 7 }, ...['b', 'e', 'f'] );
gmData.setSub( 'G', 'b', 'e', 'f', 'g' );
gmData.setSub( ['a','a'], 'aa' );
gmData.delete( 'b', 'c' );
gmData.get().a.push( 6 );
gmData.setFixedIds( 'b' );
gmData.get().z = 'Z';
console.log( gmData );
*/
var gmData = {
    data: {},
    fixedIds: [],
    defaultValue: {},
    lastUpdated: true,
    lastUpdatedKey: 'last_update',
    autoReload: true,

    setFixedIds( ...ids )
    {
        this.fixedIds = ids.flat();
    },
    setDefaultValue( val )
    {
        this.defaultValue = val;
    },
    setLastUpdated( val )
    {
        this.lastUpdated = val;
    },
    setLastUpdatedKey( val )
    {
        this.lastUpdatedKey = val;
    },
    setAutoReload( val )
    {
        this.autoReload = val;
    },

    load: function( default_value )
    {
        let val = default_value || this.defaultValue;

        this.data = GM_getValue( startup.appID, val ) || val;
    },

    get: function( ...ids )
    {
        return this.getDefault( this.defaultValue, ...ids );
    },
    getSub: function( ...ids )
    {
        if( !ids.length )
        {
            return [null, null];
        }

        let last = ids.pop();

        return [last, this.getDefault( this.defaultValue, ...ids )];
    },
    getDefault: function( default_value, ...ids )
    {
        if( this.autoReload )
        {
            this.load( default_value );
        }

        let dataLoad = this.data;

        if( this.fixedIds && this.fixedIds.length )
        {
            for( const id of this.fixedIds )
            {
                dataLoad = dataLoad[id];
            }
        }

        if( ids && ids.length )
        {
            for( const id of ids.flat() )
            {
                dataLoad = dataLoad[id];
            }
        }

        return dataLoad;
    },

    set: function( value )
    {
        this.data = value;
    },
    setSub: function( value, ...ids )
    {
        let [last, dataLoad] = this.getSub( ...ids );

        if( dataLoad )
        {
            dataLoad[last] = value;
        }
    },

    save: function( dataSave )
    {
        if( this.lastUpdated )
        {
            dataSave[this.lastUpdatedKey] = Date.now();
        }

        dataSave = dataSave || this.data;

        GM_setValue( startup.appID, dataSave );

        this.data = dataSave;
    },

    delete: function( ...ids )
    {
        let [last, dataLoad] = this.getSub( ...ids );

        if( dataLoad )
        {
            delete dataLoad[last];
        }
    },

    prettyLastUpdated( data )
    {
        let dataLoad = data || get();

        if( Object.keys( dataLoad ).includes( this.lastUpdatedKey ) )
        {
            return new Date( dataLoad[this.lastUpdatedKey] ).toLocaleString();
        }

        return null;
    }
};
