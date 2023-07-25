// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/proxy.js
// userscript must grant: GM_xmlhttpRequest
// requires request.js

unsafeWindow.gm_version = unsafeWindow.gm_version || {};
unsafeWindow.gm_version.proxy = { "version": "1.0.2", "source": "https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/proxy.js" };

class ProxyServer
{
    static url = 'http://localhost:8000/ProxyServer.py';
    static platforms = {
        linux: 'linux',
        windows: 'windows'
    };
    static platform = null;

    static request( url, type, headers={}, payload={}, responseType='application/json' )
    {
        let request = buildRequest( url, type, headers, payload, responseType );
        let proxy_request = buildRequest( ProxyServer.url, 'POST', { 'Content-Type': 'application/json' }, request, '' );

        return proxy_request;
    }

    static async send( request )
    {
        let response = await httpRequest( request );

        return response;
    }

    ////////////////////////////////////////////

    static async setPlatform()
    {
        if( await ProxyServer.isWindows() )
        {
            ProxyServer.platform = ProxyServer.platforms.windows;
        }
        else if( await ProxyServer.isLinux() )
        {
            ProxyServer.platform = ProxyServer.platforms.linux;
        }
    }

    static async getPlatform()
    {
        if( !ProxyServer.platform )
        {
            await ProxyServer.setPlatform();
        }

        return ProxyServer.platform;
    }

    static async isWindows()
    {
        let [request, response] = await ProxyServer.commandRequest( 'ver' );
        let json = JSON.parse( response.response );

        return json.text.length > 0 && json.text.join( '' ).toLowerCase().includes( 'windows' ) && 0 == json.error.length;
    }

    static async isLinux()
    {
        let [request, response] = await ProxyServer.commandRequest( 'uname -a' );
        let json = JSON.parse( response.response );

        return 1 == json.text.length && json.text[0].toLowerCase().includes( 'linux' ) && 0 == json.error.length;
    }

    static async pingRequest()
    {
        let request = ProxyServer.request( ProxyServer.url, 'PING', {}, '' );
        let response = await ProxyServer.send( request );

        return [request, response];
    }

    static async osCommandOutputRequest( cmdsWin=[], cmdsLin=[] )
    {
        let cmds = [];

        switch( await ProxyServer.getPlatform() )
        {
            case ProxyServer.platforms.windows:
                cmds = cmdsWin;
                break;
            case ProxyServer.platforms.linux:
                cmds = cmdsLin;
                break;
        }

        return await ProxyServer.commandOutputRequest( cmds );
    }

    static async commandOutputRequest( cmds=[] )
    {
        let cmd = '';

        switch( await ProxyServer.getPlatform() )
        {
            case ProxyServer.platforms.windows:
                cmd = `echo ${cmds.join( ' & echo ' )}`;
                break;
            case ProxyServer.platforms.linux:
                cmd = `${cmds.join( ';' )}`;
                break;
        }

        let request = ProxyServer.request( ProxyServer.url, 'COMMAND', {}, { cmd: cmd } );
        let response = await ProxyServer.send( request );

        return [request, response];
    }

    static async osCommandRequest( cmdWin='', cmdLin='' )
    {
        let cmd = '';

        switch( await ProxyServer.getPlatform() )
        {
            case ProxyServer.platforms.windows:
                cmd = cmdWin;
                break;
            case ProxyServer.platforms.linux:
                cmd = cmdLin;
                break;
        }

        return await ProxyServer.commandRequest( cmd );
    }

    static async commandRequest( cmd='' )
    {
        let request = ProxyServer.request( ProxyServer.url, 'COMMAND', {}, { cmd: cmd } );
        let response = await ProxyServer.send( request );

        return [request, response];
    }
}
