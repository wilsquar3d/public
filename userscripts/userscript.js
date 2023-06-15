// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/userscript.js
// userscript must grant: GM_xmlhttpRequest
// requires request.js, proxy.js

unsafeWindow.gm_version = unsafeWindow.gm_version || {};
unsafeWindow.gm_version.userscript = { version: '1.0.0', source: 'https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/userscript.js' };

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

    static async versionUrl( url )
    {
        let request = ProxyServer.request( url, 'GET' );
        let response = await ProxyServer.send( request );
        let html = $.parseHTML( response.responseText );
        let version = $( html ).find( 'span:contains("@version")' ).first().parent().text().split( 'version' )[1].trim();

        return version;
    }

    static async gmVersionUrl( url )
    {
        let request = ProxyServer.request( url, 'GET' );
        let response = await ProxyServer.send( request );
        let html = $.parseHTML( response.responseText );
        let version = $( html ).find( 'span:contains("unsafeWindow.gm_version.")' );

        version = version.length ? version.first().parent().text().split( '=' )[1].trim() : null;

        if( version )
        {
            version = JSON.parse( version ).version;
        }

        return version;
    }

    static needsUpdating( ver )
    {
        let thisVer = Userscript.version();

        return Userscript.isNotUpToDate( thisVer, ver );
    }

    static isNotUpToDate( thisVer, ver )
    {
        thisVer = thisVer.split( '.' );
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
        let version = await Userscript.versionUrl( url );

        return Userscript.needsUpdating( version );
    }

    static async gmLibsNeedUpdating()
    {
        let versions = {};

        for( const key in unsafeWindow.gm_version )
        {
            let local = unsafeWindow.gm_version[key].version;
            let remote = await Userscript.gmVersionUrl( unsafeWindow.gm_version[key].source );
            let needsUpdating = remote ? Userscript.isNotUpToDate( local, remote ) : false;

            versions[key] = {
                local: local,
                remote: remote,
                needsUpdating: needsUpdating
            };
        }

        return versions;
    }
}
