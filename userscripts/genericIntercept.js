function intercept_methodAsync( funcName, beforeFunc=null, afterFunc=null, source=null )
{
    source = source || unsafeWindow;
    const { [funcName]: originalFunc } = source;

    source[funcName] = async ( ...args ) => {
        if( beforeFunc )
        {
            beforeFunc( ...args );
        }

        const result = await originalFunc( ...args );

        if( afterFunc )
        {
            afterFunc( result, ...args );
        }

        return result;
    };
}

function intercept_method( funcName, beforeFunc=null, afterFunc=null, source=null )
{
    source = source || unsafeWindow;
    const { [funcName]: originalFunc } = source;
    
    source[funcName] = ( ...args ) => {
        if( beforeFunc )
        {
            beforeFunc( ...args );
        }

        const result = originalFunc( ...args );

        if( afterFunc )
        {
            afterFunc( result, ...args );
        }

        return result;
    };
}
