//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/utils.js

function createID( appID, varName, extras=[] )
{
    return 'ww_' + appID + '_' + varName + ( extras && extras.length > 0 ? ( '_' + extras.join( '_' ) ) : '' ) + '_ww';
}
