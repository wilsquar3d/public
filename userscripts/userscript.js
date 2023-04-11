// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/userscript.js
// userscript must grant: GM_xmlhttpRequest
// requires request.js, proxy.js

/*
console.log( Userscript.version() );
console.log( Userscript.needsUpdating( Userscript.version() ) ); // false
console.log( Userscript.needsUpdating( Userscript.version() + '.1' ) ); // true
console.log( Userscript.needsUpdating( '7.0' ) ); // true
console.log( Userscript.needsUpdating( '0.22' ) ); // true
console.log( Userscript.needsUpdating( '0.0' ) ); // false
console.log( Userscript.needsUpdating( '0' ) ); // false
console.log( await Userscript.needsUpdatingUrl( 'https://github.com/wilsquar3d/Updates/blob/main/mom/FacebookGamesFix.user.js' ) );
*/
class Userscript
{
    static metadata()
    {
        return GM_info.script;
    }

    static version()
    {
        return Userscript.metadata().version;
    }

    static needsUpdating( ver )
    {
        let thisVer = Userscript.version().split( '.' );
        ver = ver.split( '.' );

        for( let n = 0; n < ver.length; ++n )
        {
            if( n >= thisVer.length )
            {
                return true; // has extra digits
            }

            if( parseInt( ver[n] ) > parseInt( thisVer[n] ) )
            {
                return true; // matching digit in ver is larger than thisVer
            }
        }

        return false; // current version is >= ver
    }

    static async needsUpdatingUrl( url )
    {
        let request = Proxy.request( url, 'GET' );
        let response = await Proxy.send( request );
        let html = $.parseHTML( response.responseText );
        let version = $( html ).find( 'span:contains("@version")' ).first().parent().text().split( 'version' )[1].trim();

        return Userscript.needsUpdating( version );
    }
}
