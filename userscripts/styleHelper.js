// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/StyleHelper.js
// @grant        GM_addStyle

class StyleHelper
{
    static blink( loc, className='blinking', style='background-color: red !important;', interval=500 )
    {
        GM_addStyle( `.${className} { ${style} }` );

        setInterval( function() { $( loc ).toggleClass( className ); }, interval );
    }
}
