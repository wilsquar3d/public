// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/proxy.js
// userscript must grant: GM_xmlhttpRequest
// requires request.js

unsafeWindow.gm_version = unsafeWindow.gm_version || {};
unsafeWindow.gm_version.proxy = { "version": "1.0.1", "source": "https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/proxy.js" };

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

    ////////////////////////////////////////////

    static async pingRequest( url=null )
    {
        let request = ProxyServer.request( url || ProxyServer.url, 'PING', {}, '' );
        let response = await ProxyServer.send( request );

        return [request, response];
    }

    static async commandOutputRequest( url=null, cmds=[] )
    {
        let request = ProxyServer.request( url || ProxyServer.url, 'COMMAND', {}, { cmd: `echo ${cmds.join( ' & echo ' )}` } );
        let response = await ProxyServer.send( request );

        return [request, response];
    }

    static async commandRequest( url=null, cmd='' )
    {
        let request = ProxyServer.request( url || ProxyServer.url, 'COMMAND', {}, { cmd: cmd } );
        let response = await ProxyServer.send( request );

        return [request, response];
    }
}
