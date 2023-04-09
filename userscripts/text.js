// https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/text.js

class Text
{
    static trim( str )
    {
        return ( str || '' ).trim();
    }

    static isNullOrWhitespace( str )
    {
        return !Text.trim( str );
    }

    static isNullOrEmpty( str )
    {
        return !str;
    }
}
