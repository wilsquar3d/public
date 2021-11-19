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

// Combines 2 JSON structures - appending array elements or merging object properties
function jsonMerge( jsonLeft, jsonRight, rules={ tie: 'left' } )
{
    if( isObject( jsonLeft ) )
    {
        // Object has simple additive merge with ties broken by left/right rule
        if( isObject( jsonRight ) )
        {
            let leftKeys = Object.keys( jsonLeft );
            let rightKeys = Object.keys( jsonRight );

            for( const key of rightKeys )
            {
                if( leftKeys.includes( key ) )
                {
                    if( 'right' == rules.tie )
                    {
                        jsonLeft[key] = jsonRight[key];
                    }
                }
                else
                {
                    jsonLeft[key] = jsonRight[key];
                }
            }
        }
        else if( Array.isArray( jsonRight ) )
        {
            for( const elem of jsonRight )
            {
                jsonMerge( jsonLeft, elem, rules );
            }
        }
    }
    // Array is additive only - rules may allow condition adding eventually
    else if( Array.isArray( jsonLeft ) )
    {
        if( Array.isArray( jsonRight ) )
        {
            jsonLeft = jsonLeft.concat( jsonRight );
        }
        else
        {
            jsonLeft.push( jsonRight );
        }
    }

    return jsonLeft;
}

// Removes object keys from json
function jsonFilter( json, keys )
{
    let response = {};

    let objKeys = Object.keys( json );
    for( const k of objKeys )
    {
        if( !keys.includes( k ) )
        {
            response[k] = json[k];
        }
    }

    return response;
}

// Keeps only object keys from json
function jsonKeep( json, keys )
{
    let response = {};

    let objKeys = Object.keys( json );
    for( const k of keys )
    {
        if( objKeys.includes( k ) )
        {
            response[k] = json[k];
        }
    }

    return response;
}
