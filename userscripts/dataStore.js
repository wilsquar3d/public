//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/dataStore.js

function getValueGM( id, default_value )
{
    let dataLoad = GM_getValue( id, default_value );

    //display nicely - saves as timestamp
    if( Object.keys( dataLoad ).includes( 'last_update' ) )
    {
        dataLoad.last_update = new Date( dataLoad.last_update ).toLocaleString();
    }

    return dataLoad;
}

function setValueGM( id, dataSave )
{
    dataSave.last_update = Date.now();

    GM_setValue( id, dataSave );
}
