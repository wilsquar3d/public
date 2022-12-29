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

// Sort object properties by keys
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

// Sort object properties by value or sub-property value
function sortObjectValues( obj, key )
{
    let obj_key = '__obj__';
    let map = {};

    // Create map of key: original key
    $.each( Object.keys( obj ),
        function( ndx, val )
        {
            let dataKey = key ? obj[val][key] : obj[val];

            if( !map[dataKey] )
            {
                map[dataKey] = { [obj_key]: [] };
            }

            map[dataKey][obj_key].push( val );
        }
    );

    // Sort new keys and create new object in sorted order using associated old keys (also sorts by object values)
    return Object.keys( map ).sort().reduce(
        function( result, key )
        {
            $.each( map[key][obj_key].sort(),
                function( ndx, orig_key )
                {
                    result[orig_key] = obj[map[key][obj_key]];
                }
            );

            return result;
        },
        {}
    );
}

function sortObjects( json, key, sortFunc=null )
{
    if( !sortFunc )
    {
        sortFunc = ( a, b ) =>
        {
            if( a[key] === b[key] )
            {
                return 0;
            }

            if( a[key] === null )
            {
                return 1;
            }

            if( b[key] === null )
            {
                return -1;
            }

            return a[key] < b[key] ? -1 : ( a[key] > b[key] ? 1 : 0 );
        };
    }

    return json.sort( sortFunc );
}

function toJSON( text )
{
    return JSON.parse( text.trim() );
}

function fromJSON( json, indent=null )
{
    return indent ? JSON.stringify( json, true, indent ) : JSON.stringify( json );
}

// Combines 2 JSON structures - appending array elements or merging object properties
// rules: { tie: left/right, ident: <object identifying key> }
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
        // unknown - add as a single item
        if( !Array.isArray( jsonRight ) )
        {
            jsonRight = [jsonRight];
        }

        for( const item of jsonRight )
        {
            if( rules.ident )
            {
                let leftItem = jsonLeft.find( elem => elem[rules.ident] == item[rules.ident] );

                if( 'right' == rules.tie || !leftItem )
                {
                    if( leftItem )
                    {
                        jsonLeft = jsonLeft.filter( elem => elem[rules.ident] == item[rules.ident] );
                    }

                    jsonLeft.push( item );
                }
            }
            // no identity rule - add all
            else
            {
                jsonLeft.push( item );
            }
        }
    }

    return jsonLeft;
}

// Removes object keys from each object of an array
function jsonFilterList( json, keys )
{
    if( !Array.isArray( keys ) )
    {
        keys = [keys];
    }

    for( var i = 0; i < json.length; ++i )
    {
        json[i] = jsonFilter( json[i], keys );
    }

    return json;
}

// Removes object keys from json object
function jsonFilter( json, keys )
{
    if( !Array.isArray( keys ) )
    {
        keys = [keys];
    }

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

// keeps only object keys from each object of an array
function jsonKeepList( json, keys )
{
    if( !Array.isArray( keys ) )
    {
        keys = [keys];
    }

    for( var i = 0; i < json.length; ++i )
    {
        json[i] = jsonKeep( json[i], keys );
    }

    return json;
}

// Keeps only object keys from json object
function jsonKeep( json, keys )
{
    if( !Array.isArray( keys ) )
    {
        keys = [keys];
    }

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

function jsonExtract( json, key )
{
    return json[key];
}

// String replace key of each object of an array
function jsonKeyStringListReplace( json, key, replaceWhat, replaceWith='' )
{
    for( var i = 0; i < json.length; ++i )
    {
        if( json[i][key] )
        {
            json[i] = jsonKeyStringReplace( json[i], key, replaceWhat, replaceWith );
        }
    }

    return json;
}

// String replace key of object
function jsonKeyStringReplace( json, key, replaceWhat, replaceWith='' )
{
    if( json[key] )
    {
        json[key] = json[key].replace( new RegExp( replaceWhat, 'g' ), replaceWith );
    }

    return json;
}
