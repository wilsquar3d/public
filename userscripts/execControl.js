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
function waitForCondition( func, limit=5000, interval=500 )
{
    return new Promise( (resolve, reject) =>
        {
            var start_time = Date.now();

            function checkCondition()
            {
                if( func() )
                {
                    resolve();
                }
                else if (Date.now() > start_time + limit )
                {
                    reject();
                }
                else
                {
                    window.setTimeout( checkCondition, interval );
                }
            }

            checkCondition();
        }
    );
}

