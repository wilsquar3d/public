// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/json.js
//requires GM_addStyle

// TODO param colours
function syntaxHighlightStyle()
{
  GM_addStyle( '.string { color: green; } .number { color: darkorange; } .boolean { color: blue; } .null { color: magenta; } .key { color: red; }' );
}

function syntaxHighlight( json, indent='    ' )
{
    if( typeof json != 'string' )
    {
         json = JSON.stringify( json, undefined, indent );
    }

    json = json.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );

    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function( match )
        {
            var cls = 'number';

            if( /^"/.test( match ) )
            {
                cls = ( /:$/.test( match ) ) ? 'key' : 'string';
            }
            else if( /true|false/.test( match ) )
            {
                cls = 'boolean';
            }
            else if( /null/.test( match ) )
            {
                cls = 'null';
            }

            return '<span class="' + cls + '">' + match + '</span>';
        }
    );
}

function sortObjectKeys( obj )
{
    return Object.keys( obj ).sort().reduce( function( result, key )
        {
            result[key] = obj[key];
            return result;
        },
        {}
    );
}
