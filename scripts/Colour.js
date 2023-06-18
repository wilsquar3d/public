//https://raw.githubusercontent.com/wilsquar3d/public/master/scripts/colour.js
//requires utils.js

unsafeWindow.gm_version = unsafeWindow.gm_version || {};
unsafeWindow.gm_version.colour = { "version": "1.0.0", "source": "https://raw.githubusercontent.com/wilsquar3d/public/master/scripts/colour.js" };

/*
Example:
$( document ).find( 'body' ).append( $( '<div id="test" style="height:40px;width:100px;"></div>' ) );
var n = 0;
var handle = setInterval( function() {
    let colour = Colour.slide( Colour.red, Colour.green, ++n );
    let hex = Colour.rgbToHex( colour.r, colour.g, colour.b );

    $( '#test' ).css( 'background-color', hex );

    console.log( `${n}: ${hex}` );
    console.log(colour);

    if( 100 == n )
    {
        clearInterval( handle );
    }
}, 100 );
*/

class Colour
{
    static green = { r: 0, g: 255, b: 0 };
    static red = { r: 255, g: 0, b: 0 };
    static blue = { r: 0, g: 0, b: 255 };

    static slide( start, end, percent )
    {
        if( percent > 1 )
        {
            percent = percent / 100.0;
        }

        return {
            r: parseInt( start.r + ( ( end.r - start.r ) * percent ) ),
            g: parseInt( start.g + ( ( end.g - start.g ) * percent ) ),
            b: parseInt( start.b + ( ( end.b - start.b ) * percent ) ),
        };
    }

    static rgbToHex( r, g, b )
    {
        return "#" + ( "0" + r.toString( 16 ) ).slice( -2 ) + ( "0" + g.toString( 16 ) ).slice( -2 ) + ( "0" + b.toString( 16 ) ).slice( -2 );
    }

    static hexToRgb( h )
    {
        let r,g,b;

        // 3 digits
        if( h.length == 4 )
        {
            r = Colour.hexToDec( h[1] );
            g = Colour.hexToDec( h[2] );
            b = Colour.hexToDec( h[3] );
        }
        // 6 digits
        else if( h.length == 7 )
        {
            r = Colour.hexToDec( h.substring( 1, 2 ) )
            g = Colour.hexToDec( h.substring( 3, 2 ) )
            b = Colour.hexToDec( h.substring( 5, 2 ) )
        }

        return `rgb(${r},${g},${b})`;
    }

    static hexToDec( h )
    {
        return parseInt( "0x" + h[0] + ( h.length > 1 ? h[1] : h[0] ) );
    }

    static toRgbObj( str )
    {
        str = str.replace( '#', '' ).trim();

        // RGB string
        if( str.startsWith( 'RGB' ) )
        {
            let rgb = str.replace( 'RGB', '' ).replace( '(', '' ).replsce( ')' ).trim().split( ',' );

            if( 3 != rgb.length )
            {
                return null;
            }

            return {
                r: parseInt( rgb[0] ),
                g: parseInt( rgb[1] ),
                b: parseInt( rgb[2] )
            };
        }

        // hex
        if( !( 3 == str.length || 6 == str.length ) )
        {
            return null;
        }

        let n = str.length / 3;

        return {
            r: Colour.hexToDec( str.substring( 0, n ) ),
            g: Colour.hexToDec( str.substring( n, 2 * n ) ),
            b: Colour.hexToDec( str.substring( 2 * n, 3 * n ) )
        };
    }
}
