// https://raw.githubusercontent.com/wilsquar3d/public/master/scripts/jqueryHelper.js

unsafeWindow.gm_version = unsafeWindow.gm_version || {};
unsafeWindow.gm_version.colour = { "version": "1.0.0", "source": "https://raw.githubusercontent.com/wilsquar3d/public/master/scripts/jqueryHelper.js" };

class JQueryHelper
{
    static isValidSelector( qry )
    {
        try
        {
            return [!!qry, $( qry )];
        }
        catch
        {
            return [false, null];
        }
    }
}
