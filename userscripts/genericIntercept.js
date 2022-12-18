function intercept_windowMethodAsync( funcName, beforeFunc=null, afterFunc=null )
{
    const { [funcName]: originalFunc } = unsafeWindow;

    unsafeWindow[funcName] = async ( ...args ) => {
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

function intercept_windowMethod( funcName, beforeFunc=null, afterFunc=null )
{
    unsafeWindow[funcName] = ( ...args ) => {
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
