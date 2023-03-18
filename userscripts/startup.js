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
let gmLoad = new GM_Data( 'test' );
gmLoad.setAutoReload( false );
gmLoad.load();
console.log( gmLoad );

let gmData = new GM_Data( 'test' );
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
gmData.save();

{
    "a": [1,2,3,4,5,6],
    "b": {
        "d": "dddd",
        "e": {
            "f": {
                "g": "G",
                "h": 7
            }
        },
        "z": "Z"
    }, "aa": ["a","a"]
}
*/
class GM_Data
{
    id = null;
    data = {};
    defaultValue = {};
    fixedIds = [];
    lastUpdated = false;
    lastUpdatedKey = 'last_update';
    autoReload = false;

    constructor( id, lastUpdated=false, autoReload=false )
    {
        this.id = id || startup.appID || 'data';
        this.lastUpdated = lastUpdated;
        this.autoReload = autoReload;
    }

    setFixedIds( ...ids )
    {
        this.fixedIds = ids.flat();
    }
    setDefaultValue( val )
    {
        this.defaultValue = val;
    }
    setLastUpdated( val )
    {
        this.lastUpdated = val;
    }
    setLastUpdatedKey( val )
    {
        this.lastUpdatedKey = val;
    }
    setAutoReload( val )
    {
        this.autoReload = val;
    }

    load( default_value )
    {
        let val = default_value || this.defaultValue;

        this.data = GM_getValue( this.id, val ) || val;
    }

    clear()
    {
        this.data = copyJson( this.defaultValue );
    }

    get( ...ids )
    {
        return this.getDefault( this.defaultValue, ...ids );
    }
    getSub( ...ids )
    {
        if( !ids.length )
        {
            return [null, null];
        }

        let last = ids.pop();

        return [last, this.getDefault( this.defaultValue, ...ids )];
    }
    getDefault( default_value, ...ids )
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
    }

    set( value )
    {
        this.data = value;
    }
    setSub( value, ...ids )
    {
        let [last, dataLoad] = this.getSub( ...ids );

        if( dataLoad )
        {
            dataLoad[last] = value;
        }
    }

    save( dataSave )
    {
        dataSave = dataSave || this.data;

        if( this.lastUpdated )
        {
            dataSave[this.lastUpdatedKey] = Date.now();
        }

        dataSave = dataSave || this.data;

        GM_setValue( this.id, dataSave );

        this.data = dataSave;
    }

    delete( ...ids )
    {
        let [last, dataLoad] = this.getSub( ...ids );

        if( dataLoad )
        {
            delete dataLoad[last];
        }
    }

    static prettyLastUpdated( data )
    {
        let dataLoad = data || this.get();

        if( Object.keys( dataLoad ).includes( this.lastUpdatedKey ) )
        {
            return new Date( dataLoad[this.lastUpdatedKey] ).toLocaleString();
        }

        return null;
    }
}

/*
let gmNewData = new GM_NewData( 'data' );
gmNewData.setAutoReload( false );
gmNewData.clear();
gmNewData.add( 'a', 'A' );
gmNewData.add( 'a', 'B' );
gmNewData.add( 'foo', 'bar' );
gmNewData.merge();
gmNewData.add( 'a', 'C' );
console.log( gmNewData );
gmNewData.save();
*/

class GM_NewData
{
    data = null;
    newData = null;

    constructor( id, lastUpdated=false, autoReload=false )
    {
        let dataId = id || startup.appID || 'data';
        let newDataId = dataId + '_new';

        this.data = new GM_Data( dataId, lastUpdated, autoReload );
        this.newData = new GM_Data( newDataId, lastUpdated, autoReload );
    }

    setFixedIds( ...ids )
    {
        this.data.fixedIds = ids.flat();
        this.newData.fixedIds = ids.flat();
    }
    setDefaultValue( val )
    {
        this.data.defaultValue = val;
        this.newData.defaultValue = val;
    }
    setLastUpdated( val )
    {
        this.data.lastUpdated = val;
        this.newData.lastUpdated = val;
    }
    setLastUpdatedKey( val )
    {
        this.data.lastUpdatedKey = val;
        this.newData.lastUpdatedKey = val;
    }
    setAutoReload( val )
    {
        this.data.autoReload = val;
        this.newData.autoReload = val;
    }

    load()
    {
        this.data.load();
        this.newData.load();
    }

    clear()
    {
        this.data.clear();
        this.newData.clear();
    }

    add( key, value, compareFunc=null )
    {
        let update = true;
        let val = this.data.getDefault( null, key );

        if( val )
        {
            update = compareFunc
                ? compareFunc( val, value, key )
                : GM_NewData.defaultCompareFunc( val, value, key );
        }

        if( update )
        {
            this.newData.setSub( value, key );
        }
    }

    merge()
    {
        let data = this.newData.get();

        for( const key in data )
        {
            this.data.setSub( data[key], key );
        }

        this.newData.clear();
    }

    save()
    {
        this.data.save();
        this.newData.save();
    }

    //////////////////////

    static defaultCompareFunc( left, right, key )
    {
        return left != right;
    }
}
