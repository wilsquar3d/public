// https://raw.githubusercontent.com/wilsquar3d/public/master/scripts/jqueryHelper.js


class JQueryHelper
{
    static isValidSelector( qry )
    {
        try
        {
            return [true, $( qry )];
        }
        catch
        {
            return [false, null];
        }
    }
}
