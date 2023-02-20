//https://raw.githubusercontent.com/wilsquar3d/public/master/scripts/encode_decode.js
/*
// Examples
let text = 'abcdefghijklmnopqrstuvwxyz';

console.log( 'Split Reverse' );
console.log( encode_decode.splitReverse( text, 13 ) );
console.log( encode_decode.splitReverse( text, 5 ) );
console.log( encode_decode.splitReverse( text, 5, 7 ) );
console.log( 'Reverse' );
console.log( encode_decode.splitReverse( encode_decode.splitReverse( text, 13 ), 13 ) );
console.log( encode_decode.splitReverse( encode_decode.splitReverse( text, 5 ), 5 ) );
console.log( encode_decode.splitReverse( encode_decode.splitReverse( text, 5, 7 ), 5, 7 ) );

console.log( 'Split Shuffle' );
console.log( encode_decode.splitShuffle( text, 3 ) );
console.log( encode_decode.splitShuffle( text, 3, 5 ) );
console.log( 'Reverse' );
console.log( encode_decode.splitShuffleDecode( encode_decode.splitShuffle( text, 3 ), 3 ) );
console.log( encode_decode.splitShuffleDecode( encode_decode.splitShuffle( text, 3, 5 ), 3, 5 ) );

console.log( 'Split Shuffle Reverse' );
console.log( encode_decode.splitShuffleReverse( text, 3 ) );
console.log( encode_decode.splitShuffleReverse( text, 3, 5 ) );
console.log( 'Reverse' );
console.log( encode_decode.splitShuffleReverseDecode( encode_decode.splitShuffleReverse( text, 3 ), 3 ) );
console.log( encode_decode.splitShuffleReverseDecode( encode_decode.splitShuffleReverse( text, 3, 5 ), 3, 5 ) );

console.log( 'Expand' );
console.log( encode_decode.expand( text, 2 ) );
console.log( encode_decode.expand( text, 3 ) );
console.log( 'Reverse' );
console.log( encode_decode.expandDecode(encode_decode.expand( text, 2 ), 2 ) );
console.log( encode_decode.expandDecode(encode_decode.expand( text, 3 ), 3 ) );

console.log( 'Multi-Encode Example' );
let encoded = encode_decode.base64( encode_decode.splitShuffleReverse( encode_decode.expand( text, 2 ), 3 ), true );
console.log( encoded );
console.log( encode_decode.expandDecode( encode_decode.splitShuffleReverseDecode( encode_decode.base64Decode( encoded ), 3 ), 2 ) );
*/

var encode_decode = {
    reverse : function( text )
    {
        return text.split( '' ).reverse().join( '' );
    },

    base64: function( text, bNoEquals=false )
    {
        let output = btoa( text );

        if( bNoEquals )
        {
            output = output.replaceAll( '=', '' );
        }

        return output;
    },

    base64Decode: function( text )
    {
        return atob( text );
    },

    // Splits the string into size length pieces, each is then reversed. Starts after offset.
    splitReverse: function( text, size, offset=0 )
    {
        let prefix = text.slice( 0, offset );
        let pieces = Math.floor( text.length / size );
        let parts = [];

        text = text.slice( offset );

        for( let i = 0; i < pieces - 1; ++i )
        {
            parts.push( this.reverse( text.slice( 0, size ) ) );
            text = text.slice( size );
        }
        parts.push( this.reverse( text ) );

        return prefix + parts.join( '' );
    },

    splitShuffleShared: function( text, size )
    {
        let pieces = Math.floor( text.length / size );
        let swap = Math.floor( pieces / 2 );
        let parts = [];

        for( let i = 0; i < pieces - 1; ++i )
        {
            parts.push( text.slice( 0, size ) );
            text = text.slice( size );
        }
        parts.push( text );

        for( let i = 0; i < swap; i+=2 )
        {
            let temp = parts[i];
            parts[i] = parts[pieces - 1 - i];
            parts[pieces - 1 - i] = temp;
        }

        return parts;
    },

    // Splits the string into size length pieces, each is then shuffled. Starts after offset.
    splitShuffle: function( text, size, offset=0 )
    {
        let prefix = text.slice( 0, offset );
        text = text.slice( offset );

        let parts = this.splitShuffleShared( text, size );

        return prefix + parts.join( '' );
    },

    // Splits the string into size length pieces, each is then reversed and shuffled. Starts after offset.
    splitShuffleReverse: function( text, size, offset=0 )
    {
        let prefix = text.slice( 0, offset );
        text = text.slice( offset );

        let parts = this.splitShuffleShared( text, size, offset ).map( x => this.reverse( x ) );

        return prefix + parts.join( '' );
    },

    splitShuffleDecodeShared: function( text, size )
    {
        let pieces = Math.floor( text.length / size );
        let swap = Math.floor( pieces / 2 );
        let parts = [text.slice( 0, text.length - ( ( pieces - 1 ) * size ) )];

        text = text.slice( text.length - ( ( pieces - 1 ) * size ) )

        for( let i = 0; i < pieces - 1; ++i )
        {
            parts.push( text.slice( 0, size ) );
            text = text.slice( size );
        }

        for( let i = 0; i < swap; i+=2 )
        {
            let temp = parts[i];
            parts[i] = parts[pieces - 1 - i];
            parts[pieces - 1 - i] = temp;
        }

        return parts;
    },

    splitShuffleDecode: function( text, size, offset=0 )
    {
        let prefix = text.slice( 0, offset );
        text = text.slice( offset );

        let parts = this.splitShuffleDecodeShared( text, size );

        return prefix + parts.join( '' );
    },

    splitShuffleReverseDecode: function( text, size, offset=0 )
    {
        let prefix = text.slice( 0, offset );
        text = text.slice( offset );

        let parts = this.splitShuffleDecodeShared( text, size, offset ).map( x => this.reverse( x ) );

        return prefix + parts.join( '' );
    },

    // Splits each character into size other characters
    expand: function( text, size, offset=0 )
    {
        let prefix = text.slice( 0, offset );
        text = text.slice( offset );

        let output = [];

        text.split( '' ).map( x => {
            let code = x.charCodeAt( 0 );
            let piece = Math.floor( code / size );
            let str = '';

            for( let i = 0; i < size - 1; ++i )
            {
                let char_code = piece - i - 1;
                str += String.fromCharCode( char_code );
                code -= char_code;
            }
            str += String.fromCharCode( code );

            output.push( str );

        } );

        return prefix + output.join( '' );
    },

    expandDecode: function( text, size, offset=0 )
    {
        let prefix = text.slice( 0, offset );
        text = text.slice( offset );

        let output = [];
        let pieces = text.length / size;

        for( let i = 0; i < pieces; ++i )
        {
            let code = text.slice( 0, size ).split( '' ).map( x => x.charCodeAt( 0 ) ).reduce( (sum, n) => sum + n, 0 );
            text = text.slice( size );

            output.push( String.fromCharCode( code ) );
        }

        return prefix + output.join( '' );
    }
};
