//https://raw.githubusercontent.com/wilsquar3d/public/master/github/github_api.proxy.js
// requires request.js, util.js

/*
// usage example
let token = 'github_pat_<token>';
let repo = '<REPO>';
let path = '<PATH>/<FILE.EXE>';
let content = '<FILE CONTENT>';

github_api.setConfig( token, repo, path );
console.log( await github_api.sha() );
console.log( await github_api.get() );
console.log( await github_api.getManual( token, repo, path ) );
console.log( await github_api.put( content ) );
console.log( await github_api.putManual( token, repo, path, content ) );
*/

var github_api = {
    proxy_url: 'http://localhost:8000/ProxyServer.py',
    owner: 'wilsquar3d',
    config: {
        token: '',
        repo: '',
        path: ''
    },

    setProxyUrl: function( url ) {
        this.proxy_url = url;
    },
    setOwner: function( owner ) {
        this.owner = owner;
    },
    setConfig: function( token, repo, path ) {
        this.config.token = token;
        this.config.repo = repo;
        this.config.path = path;
    },

    url: function()
    {
        return `https://api.github.com/repos/${this.owner}/${this.config.repo}/contents/${this.config.path}`;
    },
    headers: function() {
        return {
            Authorization: `Bearer ${this.config.token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };
    },
    payload: function( commit_data, sha, msg='' ) {
        let payload = {
            message: msg,
            content: this.payloadContentEncode( commit_data )
        };

        if( sha )
        {
            payload.sha = sha;
        }

        return payload;
    },
    
    payloadContentEncode: function( str ) {
        return btoa( unescape( encodeURIComponent( str ) ) );
    },
    
    payloadContentDecode: function( str ) {
        return decodeURIComponent( escape( atob( str ) ) );
    },

    get: async function() {
        let request = buildRequest( this.url(), 'GET', this.headers(), '', 'application/json' );
        let proxy_request = buildRequest( this.proxy_url, 'POST', { 'Content-Type': 'application/json' }, request, '' );

        return await httpRequest( proxy_request );
    },

    getManual: async function( token, repo, path ) {
        let config = JSON.stringify( this.config );

        this.setConfig( token, repo, path );
        let response = this.get();

        this.config = JSON.parse( config );

        return response;
    },

    put: async function( commit_data, msg='' ) {
        let sha = await this.sha();
        let request = buildRequest( this.url(), 'PUT', this.headers(), this.payload( commit_data, sha, msg ), 'application/json' );
        let proxy_request = buildRequest( this.proxy_url, 'POST', { 'Content-Type': 'application/json' }, request, '' );

        return await httpRequest( proxy_request );
    },

    putManual: async function( token, repo, path, commit_data, msg='' ) {
        let config = JSON.stringify( this.config );

        this.setConfig( token, repo, path );
        let response = this.put( commit_data, msg );

        this.config = JSON.parse( config );

        return response;
    },

    sha: async function() {
        let result = await this.get();
        let response = JSON.parse( result.response );

        if( isJson( response.content ) && response.content )
        {
            let content = JSON.parse( response.content );

            return content.sha;
        }

        return null;
    }
};
