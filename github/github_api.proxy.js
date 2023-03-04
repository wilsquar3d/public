//https://raw.githubusercontent.com/wilsquar3d/public/master/github/github_api.proxy.js
// requires request.js, util.js

/*
// usage example
let token = 'github_pat_<token>';
let repo = '<REPO>';
let path = '<PATH>/<FILE.EXE>';
let content = '<FILE CONTENT>';

github_api.setConfig( token, repo, path, <requestType> );
console.log( await github_api.sha() );
console.log( await github_api.get() );
console.log( await github_api.get( github_api.requestTypes.commit ) );
console.log( await github_api.getManual( token, repo, path ) );
console.log( await github_api.getManual( token, repo, path, github_api.requestTypes.commit ) );
console.log( await github_api.put( content ) );
console.log( await github_api.putManual( token, repo, path, content ) );
*/

var github_api = {
    proxy_url: 'http://localhost:8000/ProxyServer.py',
    owner: 'wilsquar3d',
    config: {
        token: '',
        repo: '',
        path: '',
        requestType: '' // default is content
    },
    page: 1,
    per_page: 1,

    requestTypes: {
        content: 'contents',
        commit: 'commits'
    },

    setProxyUrl: function( url )
    {
        this.proxy_url = url;
    },
    setOwner: function( owner )
    {
        this.owner = owner;
    },
    setPerPage: function( val )
    {
        this.per_page = val;
    },
    setConfig: function( token, repo, path, requestType )
    {
        this.config.token = token;
        this.config.repo = repo;
        this.config.path = path;
        this.config.requestType = requestType || this.requestTypes.content;
    },

    url: function( requestType )
    {
        let type = requestType || this.config.requestType || this.requestTypes.content;

        switch( type )
        {
            case this.requestTypes.content:
                return `https://api.github.com/repos/${this.owner}/${this.config.repo}/contents/${this.config.path}`;
            case this.requestTypes.commit:
                return `https://api.github.com/repos/${this.owner}/${this.config.repo}/commits?path=${this.config.path}${valDefined( this.page, '&page=' )}${valDefined( this.per_page, '&per_page=' )}`;
        }
    },
    headers: function()
    {
        return {
            Authorization: `Bearer ${this.config.token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };
    },
    payload: function( commit_data, sha, msg='' )
    {
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
    
    payloadContentEncode: function( str )
    {
        return btoa( unescape( encodeURIComponent( str ) ) );
    },
    
    payloadContentDecode: function( str )
    {
        return decodeURIComponent( escape( atob( str ) ) );
    },

    get: async function( requestType )
    {
        let request = buildRequest( this.url( requestType ), 'GET', this.headers(), '', 'application/json' );
        let proxy_request = buildRequest( this.proxy_url, 'POST', { 'Content-Type': 'application/json' }, request, '' );
        let response = await httpRequest( proxy_request );

        return response;
    },

    getManual: async function( token, repo, path, requestType )
    {
        let config = JSON.stringify( this.config );

        this.setConfig( token, repo, path, requestType );
        let response = this.get();

        this.config = JSON.parse( config );

        return response;
    },

    put: async function( commit_data, msg='' )
    {
        let sha = await this.sha();
        let request = buildRequest( this.url(), 'PUT', this.headers(), this.payload( commit_data, sha, msg ), 'application/json' );
        let proxy_request = buildRequest( this.proxy_url, 'POST', { 'Content-Type': 'application/json' }, request, '' );
        let response = await httpRequest( proxy_request );

        return response;
    },

    putManual: async function( token, repo, path, commit_data, msg='' )
    {
        let config = JSON.stringify( this.config );

        this.setConfig( token, repo, path, this.requestTypes.content );
        let response = this.put( commit_data, msg );

        this.config = JSON.parse( config );

        return response;
    },

    // get sha from contents URL - workaround commits URL bug
    sha: async function()
    {
        let result = await this.get( this.requestTypes.content );
        let response = JSON.parse( result.response );

        if( isJson( response.content ) && response.content )
        {
            let content = JSON.parse( response.content );

            return content.sha;
        }

        return null;
    },

    // get sha from commits URL - github API blocks put with 409 response
    commitSha: async function()
    {
        let result = await this.get( this.requestTypes.commit );
        let response = JSON.parse( result.response );

        if( isJson( response.content ) && response.content )
        {
            let content = JSON.parse( response.content );

            if( content.length )
            {
                return content[0].sha;
            }
        }

        return null;
    },

    commits: async function()
    {
        let result = await this.get( this.requestTypes.commit );
        let response = JSON.parse( result.response );

        return response;
    }
};

function loadGitProps( repo, path )
{
    return {
        token: encode_decode.expandDecode( encode_decode.splitShuffleReverseDecode( encode_decode.base64Decode( sharedVars.token.github ), 3 ), 2 ),
        repo: repo,
        path: path
    };
}
