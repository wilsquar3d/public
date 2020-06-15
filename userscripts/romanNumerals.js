//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/romanNumerals.js

function romanNumeralToInt( str )
{
    const ROMAN_NUMERALS = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

    var result = 0;
    var input = str.toUpperCase().trim().split( '' );

    for( var i = 0; i < input.length; ++i )
    {
        var letter = ROMAN_NUMERALS[input[i]];
        var next = ROMAN_NUMERALS[input[i+1]];

        if( !letter )
        {
            return -1;
        }

        if( next && letter < next )
        {
            result += next - letter;
            ++i;
        }
        else
        {
            result +=  letter;
        }
    }

    return result;
}
