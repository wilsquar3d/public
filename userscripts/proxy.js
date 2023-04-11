// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/proxy.js
// userscript must grant: GM_xmlhttpRequest
// requires request.js

class Proxy
{
    static url = 'http://localhost:8000/ProxyServer.py';

    static request( url, type, headers={}, payload={}, responseType='application/json' )
    {
        let request = buildRequest( url, type, headers, payload, responseType );
        let proxy_request = buildRequest( Proxy.url, 'POST', { 'Content-Type': 'application/json' }, request, '' );

        return proxy_request;
    }

    static async send( request )
    {
        let response = await httpRequest( request );

        return response;
    }
}
