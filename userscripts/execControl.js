//

function runFunc( func, delay=500 )
{
    if( !func() )
    {
        setTimeout( runFunc, delay, func, delay );
    }
}

//func: 0 parameter function
//callback (optional): 0 parameter function or null
//delay (optional): number
var runFuncCallbackProps_default = { func: function(){ }, callback: null, delay: 500 };

//TODO failover after # tries
function runFuncCallback( props, initDelay=500 )
{
    setTimeout( runFuncCallbackHelper, initDelay, props, 500 ); //default per iteration delay of 0.5s
}

function runFuncCallbackHelper( props, delay )
{
    if( !props.func() )
    {
        setTimeout( runFuncCallbackHelper, props.delay ? props.delay : delay, props, delay );
    }
    else if( props.callback )
    {
        runFuncCallbackHelper( props.callback, delay );
    }
}
