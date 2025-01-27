// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/StyleHelper.js
// @require      https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/utils.js
// @require      https://raw.githubusercontent.com/wilsquar3d/public/master/scripts/jqueryHelper.js
// @grant        GM_addStyle


unsafeWindow.gm_version = unsafeWindow.gm_version || {};
unsafeWindow.gm_version.colour = { "version": "1.0.0", "source": "https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/StyleHelper.js" };

class StyleHelper
{
    // input can be query or style to be tested
    static computedStyle( input )
    {
        let style = null;
        let [valid, elem] = JQueryHelper.isValidSelector( input );

        if( valid )
        {
            style = JSON.parse( JSON.stringify( window.getComputedStyle( document.body.appendChild( elem[0] ) ) ) );
        }
        else
        {
            let id = 'id_' + guid();
            let temp = $( `<div id='${id}' style='${input}' />` );
            style = JSON.parse( JSON.stringify( window.getComputedStyle( document.body.appendChild( temp[0] ) ) ) );

            $( '#' + id ).remove();
        }

        return style;
    }

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

    // content can be text or element
    // click swaps className to className2 for delay amount of time
    static feedbackLinkBase( content, className='', style='', className2='', style2='', delay=1000 )
    {
        GM_addStyle( `.${className} { ${style} }` );

        let elem = StyleHelper.link( content, '#', className );

        if( className2 && style2 )
        {
            GM_addStyle( `.${className2} { ${style2} }` );

            elem.click(
                function()
                {
                    $( elem ).removeClass( className ).addClass( className2 );

                    setTimeout(
                        function()
                        {
                            $( elem ).removeClass( className2 ).addClass( className );
                        },
                        delay
                    );
                }
            );
        }

        return elem;
    }

    static feedbackLink( content, style='color: black !important; background-color: white;', style2='color: white !important; background-color: black;' )
    {
        return StyleHelper.feedbackLinkBase( content, 'class_' + guid(), style, 'class_' + guid(), style2 );
    }

    static invertFeedbackLink( content, style='', delay=1000 )
    {
        let tempStyle = StyleHelper.computedStyle( style );

        let color = style ? tempStyle.color.toUpperCase() : '00F';
        let bground = tempStyle.backgroundColor.toUpperCase();
        let invertStyle = `color: ${Colour.invert( color )} !important; background-color: ${Colour.invert( bground )};`;

        return StyleHelper.feedbackLinkBase( content, 'class_' + guid(), style, 'class_' + guid(), invertStyle, delay );
    }

    static link( content, href, className='' )
    {
        return isString( content )
            ? $( `<a href='${href}' class='${className}'>${content}</a>` )
            : $( `<a href='${href}' class='${className}'></a>` ).append( $( content ) );
    }

    static fadeOut( elem, func=false, delay=50, inter=0.1 )
    {
        let op = 1;
        let timer = setInterval
        (
            function()
            {
                if( op < inter )
                {
                    clearInterval( timer );
    
                    if( func )
                    {
                        elem.css( 'opacity', 0 );
                        func();
                    }
                    else
                    {
                        elem.css( 'display', 'none' );
                    }
                }
                else
                {
                    elem.css( 'opacity', op );
                    op -= op * inter;
                }
            },
            delay
        );
    }
}
