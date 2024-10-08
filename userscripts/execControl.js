//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/execControl.js

function runFunc( func, delay=500 )
{
    if( !func() )
    {
        setTimeout( function(){ runFunc( func, delay); }, delay );
    }
}

//func: 0 parameter function
//callback (optional): 0 parameter function or null
//delay (optional): number
var runFuncCallbackProps_default = { func: function(){ }, callback: null, delay: 500 };

//TODO failover after # tries
function runFuncCallback( props, initDelay=500, defaultCallbackDelay=100 )
{
    setTimeout( runFuncCallbackHelper, initDelay, props, defaultCallbackDelay );
}

function runFuncCallbackHelper( props, delay )
{
    if( !props.func() )
    {
        setTimeout( runFuncCallbackHelper, props.delay ? props.delay : delay, props, delay );
    }
    else if( props.callback )
    {
        runFuncCallback( props.callback, props.delay ? props.delay : delay );
    }
}

//dynamically call a function by name with arguments
function funcCall( name, ...args )
{
    let func = eval( name );

    return func( ...args );
}

//dynamically wait for a condition to be true
//Ex. waitForCondition( <func for success> ).then( () => { <conditional code> } );
async function waitForCondition( func, limit=5000, interval=500 )
{
    var start_time = Date.now();

    while( true )
    {
        if( func() )
        {
            return;
        }

        if( Date.now() > start_time + limit )
        {
            throw 'Condition "' + func.name + '" failed!';
        }

        await new Promise( resolve => setTimeout( resolve, interval ) );
    }
}

// selector is jQuery selector, default 'body'
// handlerFunc( records ) {}
function watchDom( handlerFunc, selector, defaultConifg = { childList: true, characterData: false, attributes: false, subtree: true } )
{
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || unsafeWindow.MutationObserver || unsafeWindow.WebKitMutationObserver;
    let observer = new MutationObserver( handlerFunc );
    let observerConfig = {
        childList: defaultConifg.childList,
        characterData: defaultConifg.characterData,
        attributes: defaultConifg.attributes,
        subtree: defaultConifg.subtree
    };

    $( selector || 'body' ).each(
        function()
        {
            observer.observe( this, observerConfig );
        }
    );
}

function promiseWrapper( func, ...args )
{
    return new Promise(
        function( resolve, reject )
        {
            try
            {
                let result = func( ... args );
                resolve( result );
            }
            catch ( ex )
            {
                reject( ex );
            }
        }
    );
}

function promiseWrapperAsync( func, ...args )
{
    return new Promise(
        async function( resolve, reject )
        {
            try
            {
                let result = await func( ... args );
                resolve( result );
            }
            catch ( ex )
            {
                reject( ex );
            }
        }
    );
}
