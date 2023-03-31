// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/StyleHelper.js
// @require      https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/utils.js
// @require      https://raw.githubusercontent.com/wilsquar3d/public/master/scripts/jqueryHelper.js
// @grant        GM_addStyle

class StyleHelper
{
    // qry can be query, element or string
    static content( qry )
    {
        let [valid, elem] = JQueryHelper.isValidSelector( qry );

        return valid && elem.length
            ? elem.val() || elem.text()
            : qry;
    }

    // wrapper to return the element after setting text
    static setText( qry, text )
    {
        let elem = $( qry );
        elem.text( text );

        return elem;
    }

    static blink( qry, className='blinking', style='background-color: red !important;', interval=500 )
    {
        GM_addStyle( `.${className} { ${style} }` );

        setInterval( function() { $( qry ).toggleClass( className ); }, interval );
    }

    // src can be query or element
    // copy can be query, element or string
    static copyToClipboard( src, copy )
    {
        let elem = $( src );
        elem.click( () => navigator.clipboard.writeText( StyleHelper.content( copy ) ) );

        return elem;
    }

    // content can be text or element
    // copy can be query, element or string
    static copyToClipboardLink( content, copy, className='' )
    {
        let elem = StyleHelper.link( content, '#', className )
        StyleHelper.copyToClipboard( elem, copy );

        return elem;
    }

    static link( content, href, className='' )
    {
        return isString( content )
            ? $( `<a href='${href}' class='${className}'>${content}</a>` )
            : $( `<a href='${href}' class='${className}'></a>` ).append( $( content ) );
    }
}
