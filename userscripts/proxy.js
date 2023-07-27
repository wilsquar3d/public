// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/proxy.js
// userscript must grant: GM_xmlhttpRequest
// requires request.js

unsafeWindow.gm_version = unsafeWindow.gm_version || {};
unsafeWindow.gm_version.proxy = { "version": "1.2.0", "source": "https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/proxy.js" };

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

    static locations = {
        node: {
            value: '',
            linux: '/home/wwilson/git/wilsquar3d/nodejs/',
            windows: 'C:/nodejs/'
        }
    };

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

    static async setLocation( key )
    {
        let os = await ProxyCommand.getPlatform();

        ProxyCommand.locations[key].value = ProxyCommand.locations[key][os];
    }

    static async getLocation( key )
    {
        if( !ProxyCommand.locations[key] )
        {
            return null;
        }

        if( !ProxyCommand.locations[key].value )
        {
            await ProxyCommand.setLocation( key );
        }

        return ProxyCommand.locations[key].value;
    }

    static async getNodeLocation()
    {
        return await ProxyCommand.getLocation( 'node' );
    }

    ///////////////////////////////////////////////////

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

    // pick the right OS output
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

    // run different command(s) based on the running OS
    static async osCommandOutputRequest( cmdsWin=[], cmdsLin=[] )
    {
        let cmds = await ProxyCommand.osCommand( cmdsWin, cmdsLin );

        return await ProxyCommand.commandOutputRequest( cmds );
    }

    // format and combine commands for OS output(s)
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

    // run raw command
    static async osCommandRequest( cmdWin='', cmdLin='' )
    {
        let cmd = await ProxyCommand.osCommand( cmdWin, cmdLin );

        return await ProxyCommand.commandRequest( cmd );
    }

    ///////////////////////////////////////////////////

    static async nodeCommandRequest( cmd )
    {
        let loc = await ProxyCommand.getNodeLocation();
        cmd = 'node ' + loc + cmd;

        return await ProxyCommand.commandRequest( cmd );
    }
}

class ProxyNodeCommand
{
    static async urlCache( imgUrl )
    {
        return await ProxyCommand.nodeCommandRequest( `file_cacher/url_cacher.js --url ${imgUrl}` );
    }
}

class ProxyTerminalCommand
{
    static async datetime()
    {
        return await ProxyCommand.osCommandRequest( 'echo %date% %time%', 'date' );
    }
}
