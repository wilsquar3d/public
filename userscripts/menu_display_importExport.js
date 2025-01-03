//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/menu_display_importExport.js
//requires menu.js, utils.js, request.js
// WithGit also requires: github_api.proxy.js, encode_decode.js, https://crypto.stanford.edu/sjcl/sjcl.js

function display_importExport( id )
{
    let displayDataID = createID( id.replace( '#', '' ), 'importExportData' );

    $( id ).append(
        $( '<div style="width:100%;height:100%;" />' ).append(
            [
                $( '<div style="padding:10px;height:calc(100% - 50px);" />' ).append(
                    $( '<textarea id="' + displayDataID + '" style="width:100%;height:100%;white-space:nowrap;" />' )
                        .on( 'input change', function(){ isJson( $( this ), global_defaults.css.bgWhite, global_defaults.css.bgRed, $( '#import' ) ) } )
                ),
                $( '<input type="button" value="Import" id="import" style="margin-right:10px;" />' ).click(
                    function()
                    {
                        let displayData = JSON.parse( $( '#' + displayDataID ).val() );
                        let keys = Object.keys( displayData );

                        $.each( keys,
                            function( ndx, key )
                            {
                                GM_setValue( key, displayData[key] );
                            });
                    }
                ),
                $( '<input type="button" value="Export" id="export" />' ).click(
                    function()
                    {
                        let displayData = {};

                        $.each( GM_listValues(),
                            function( ndx, key )
                            {
                                let value = GM_getValue( key, {} );
                                if( value )
                                {
                                    displayData[key] = value;
                                }
                            });

                        $( '#' + displayDataID ).val( JSON.stringify( displayData, true, '  ' ) );
                        $( '#' + displayDataID ).change();
                    }
                )
            ]

        )
    );

    $( '#export' ).click();
}

// props: { token: <base64, password encrypted token>, repo: <repository>, path: <file/path.ext> }
function display_importExportWithGit( id, props )
{
    let displayDataID = createID( id.replace( '#', '' ), 'importExportDataGit' );

    $( id ).append(
        $( '<div style="width:100%;height:100%;" />' ).append(
            [
                $( '<div style="padding:10px;height:calc(100% - 50px);" />' ).append(
                    $( '<textarea id="' + displayDataID + '" style="width:100%;height:100%;white-space:nowrap;" />' )
                        .on( 'input change', function(){ isJson( $( this ), global_defaults.css.bgWhite, global_defaults.css.bgRed, $( '#import' ) ) } )
                ),
                $( '<input type="button" value="Import/Save" id="import" style="margin-right:10px;" />' ).click(
                    function()
                    {
                        let displayData = JSON.parse( $( '#' + displayDataID ).val() );
                        let keys = Object.keys( displayData );

                        $.each( keys,
                            function( ndx, key )
                            {
                                GM_setValue( key, displayData[key] );
                            });
                    }
                ),
                $( '<input type="button" value="Export/Load" id="export" style="margin-right:10px;" />' ).click(
                    function()
                    {
                        let displayData = {};

                        $.each( GM_listValues(),
                            function( ndx, key )
                            {
                                let value = GM_getValue( key, {} );
                                if( value )
                                {
                                    displayData[key] = value;
                                }
                            });

                        $( '#' + displayDataID ).val( JSON.stringify( displayData, true, '  ' ) );
                        $( '#' + displayDataID ).change();
                    }
                ),
                $( '<input type="button" value="Clear" id="clear" style="margin-right:10px;" />' ).click(
                    function()
                    {
                        $( '#' + displayDataID ).val( '' );
                        $( '#' + displayDataID ).change();
                    }
                ),
                $( '<input type="password" id="password" style="margin-right:10px;" />' ),
                $( '<input type="button" value="Commit" id="commit" style="margin-right:10px;" />' ).click(
                    async function()
                    {
                        let displayData = {};

                        $.each( GM_listValues(),
                            function( ndx, key )
                            {
                                let value = GM_getValue( key, {} );
                                if( value )
                                {
                                    displayData[key] = value;
                                }
                            });

                        let commit_data = JSON.stringify( displayData, true, '  ' );

                        try
                        {
                            let token = sjcl.decrypt( $( '#password' ).val(), atob( props.token ) );

                            github_api.setConfig( token, props.repo, props.path );
                            await github_api.put( commit_data );

                            $( '#password' ).val( '' );
                        }
                        catch( ex )
                        {
                            console.log( 'Commit failed' );
                            console.error( ex );
                        }
                    }
                ),
                $( '<input type="button" value="Pull" id="pull" />' ).click(
                    async function()
                    {
                        $( '#' + displayDataID ).val( '' );

                        try
                        {
                            let token = sjcl.decrypt( $( '#password' ).val(), atob( props.token ) );

                            github_api.setConfig( token, props.repo, props.path );
                            let result = await github_api.get();

                            $( '#password' ).val( '' );

                            let response = JSON.parse( result.response );

                            if( isJson( response.content ) && response.content )
                            {
                                let content = JSON.parse( response.content );

                                if( content.content )
                                {
                                    $( '#' + displayDataID ).val( atob( content.content ) ).change();
                                }
                                else if( content.download_url ) // use download url
                                {
                                    let dlRequest = buildRequest( content.download_url, 'GET', '', null, 'application/json' );
                                    let response = await httpRequest( dlRequest );

                                    $( '#' + displayDataID ).val( response.response ).change();
                                }
                                else
                                {
                                    console.error( response );
                                }
                            }
                        }
                        catch( ex )
                        {
                            console.log( 'pull failed' );
                            console.error( ex );
                        }
                    }
                )
            ]

        )
    );

    $( '#export' ).click();
}

function loadGitProps( repo, path )
{
    return {
        token: encode_decode.expandDecode( encode_decode.splitShuffleReverseDecode( encode_decode.base64Decode( sharedVars.token.github ), 3 ), 2 ),
        repo: repo,
        path: path
    };
}
