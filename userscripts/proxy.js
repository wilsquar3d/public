// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/proxy.js
// userscript must grant: GM_xmlhttpRequest
// requires request.js

unsafeWindow.gm_version = unsafeWindow.gm_version || {};
unsafeWindow.gm_version.proxy = { "version": "1.1.0", "source": "https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/proxy.js" };

class ProxyServer
{
    static url = 'http://localhost:8000/ProxyServer.py';

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
}

class ProxyCommand
{
    static platforms = {
        linux: 'linux',
        windows: 'windows'
    };
    static platform = null;

    static async setPlatform()
    {
        if( await ProxyCommand.isWindows() )
        {
            ProxyCommand.platform = ProxyCommand.platforms.windows;
        }
        else if( await ProxyCommand.isLinux() )
        {
            ProxyCommand.platform = ProxyCommand.platforms.linux;
        }
    }

    static async getPlatform()
    {
        if( !ProxyCommand.platform )
        {
            await ProxyCommand.setPlatform();
        }

        return ProxyCommand.platform;
    }

    static async isWindows()
    {
        let [request, response] = await ProxyCommand.commandRequest( 'ver' );
        let json = JSON.parse( response.response );

        return json.text.length > 0 && json.text.join( '' ).toLowerCase().includes( 'windows' ) && 0 == json.error.length;
    }

    static async isLinux()
    {
        let [request, response] = await ProxyCommand.commandRequest( 'uname -a' );
        let json = JSON.parse( response.response );

        return 1 == json.text.length && json.text[0].toLowerCase().includes( 'linux' ) && 0 == json.error.length;
    }

    ///////////////////////////////////////////////////

    static async pingRequest()
    {
        let request = ProxyServer.request( ProxyServer.url, 'PING', {}, '' );
        let response = await ProxyServer.send( request );

        return [request, response];
    }

    static async commandRequest( cmd='' )
    {
        let request = ProxyServer.request( ProxyServer.url, 'COMMAND', {}, { cmd: cmd } );
        let response = await ProxyServer.send( request );

        return [request, response];
    }

    ///////////////////////////////////////////////////

    static async osCommand( cmdWin, cmdLin )
    {
        let cmd = null;

        switch( await ProxyCommand.getPlatform() )
        {
            case ProxyCommand.platforms.windows:
                cmd = cmdWin;
                break;
            case ProxyCommand.platforms.linux:
                cmd = cmdLin;
                break;
        }

        return cmd;
    }

    static async osCommandOutputRequest( cmdsWin=[], cmdsLin=[] )
    {
        let cmds = await ProxyCommand.osCommand( cmdsWin, cmdsLin );

        return await ProxyCommand.commandOutputRequest( cmds );
    }

    static async commandOutputRequest( cmds=[] )
    {
        let cmd = '';

        switch( await ProxyCommand.getPlatform() )
        {
            case ProxyCommand.platforms.windows:
                cmd = `echo ${cmds.join( ' & echo ' )}`;
                break;
            case ProxyCommand.platforms.linux:
                cmd = `${cmds.join( ';' )}`;
                break;
        }

        return await ProxyCommand.commandRequest( cmd );
    }

    static async osCommandRequest( cmdWin='', cmdLin='' )
    {
        let cmd = await ProxyCommand.osCommand( cmdWin, cmdLin );

        return await ProxyCommand.commandRequest( cmd );
    }
}
