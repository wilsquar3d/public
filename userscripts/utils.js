function createID( appID, varName, extras=[] )
{
    return 'ww_' + appID + '_' + varName + ( extras && extras.length > 0 ? ( '_' + extras.join( '_' ) ) : '' ) + '_ww';
}
