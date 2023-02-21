//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/menu_display_importExport.js
//requires menu.js, utils.js, request.js
// WithGit also requires: github_api.proxy.js, https://crypto.stanford.edu/sjcl/sjcl.js

function display_importExport( id )
{
    var dataID = createID( id, 'importExportData' );

    $( id ).append(
        $( '<div style="width:100%;height:100%;" />' ).append(
            [
                $( '<div style="padding:10px;height:calc(100% - 50px);" />' ).append(
                    $( '<textarea id="' + dataID + '" style="width:100%;height:100%;white-space:nowrap;" />' )
                        .on( 'input change', function(){ isJson( $( this ), global_defaults.css.bgWhite, global_defaults.css.bgRed, $( '#import' ) ) } )
                ),
                $( '<input type="button" value="Import" id="import" style="margin-right:10px;" />' ).click(
                    function()
                    {
                        var data = JSON.parse( $( '#' + dataID ).val() );
                        var keys = Object.keys( data );

                        $.each( keys,
                            function( ndx, key )
                            {
                                GM_setValue( key, data[key] );
                            });
                    }
                ),
                $( '<input type="button" value="Export" id="export" />' ).click(
                    function()
                    {
                        var data = {};

                        $.each( GM_listValues(),
                            function( ndx, key )
                            {
                                let value = GM_getValue( key, {} );
                                if( value )
                                {
                                    data[key] = value;
                                }
                            });

                        $( '#' + dataID ).val( JSON.stringify( data, true, '  ' ) );
                        $( '#' + dataID ).change();
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
    var dataID = createID( id, 'importExportDataGit' );

    $( id ).append(
        $( '<div style="width:100%;height:100%;" />' ).append(
            [
                $( '<div style="padding:10px;height:calc(100% - 50px);" />' ).append(
                    $( '<textarea id="' + dataID + '" style="width:100%;height:100%;white-space:nowrap;" />' )
                        .on( 'input change', function(){ isJson( $( this ), global_defaults.css.bgWhite, global_defaults.css.bgRed, $( '#import' ) ) } )
                ),
                $( '<input type="button" value="Import" id="import" style="margin-right:10px;" />' ).click(
                    function()
                    {
                        var data = JSON.parse( $( '#' + dataID ).val() );
                        var keys = Object.keys( data );

                        $.each( keys,
                            function( ndx, key )
                            {
                                GM_setValue( key, data[key] );
                            });
                    }
                ),
                $( '<input type="button" value="Export" id="export" style="margin-right:10px;" />' ).click(
                    function()
                    {
                        var data = {};

                        $.each( GM_listValues(),
                            function( ndx, key )
                            {
                                let value = GM_getValue( key, {} );
                                if( value )
                                {
                                    data[key] = value;
                                }
                            });

                        $( '#' + dataID ).val( JSON.stringify( data, true, '  ' ) );
                        $( '#' + dataID ).change();
                    }
                ),
                $( '<input type="password" id="password" style="margin-right:10px;" />' ),
                $( '<input type="button" value="Commit" id="commit" />' ).click(
                    async function()
                    {
                        var data = {};

                        $.each( GM_listValues(),
                            function( ndx, key )
                            {
                                let value = GM_getValue( key, {} );
                                if( value )
                                {
                                    data[key] = value;
                                }
                            });

                        let commit_data = JSON.stringify( data, true, '  ' );

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
                )
            ]

        )
    );

    $( '#export' ).click();
}
