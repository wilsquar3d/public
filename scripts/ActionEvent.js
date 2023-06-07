//https://raw.githubusercontent.com/wilsquar3d/public/master/scripts/ActionEvent.js

// Example: new ActionEvent().dispatchClick( <jquery_elem> );
class ActionEvent
{
    canBubble = true;
    cancelable = true;
    view = unsafeWindow;
    detail = 1;
    screenX = 1;
    screenY = 1;
    clientX = 1;
    clientY = 1;
    ctrlKey = false;
    altKey = false;
    shiftKey = false;
    metaKey = false;
    button = 0;
    relatedTarget = null;

    type = null;
    event = null;

    constructor( type='MouseEvents', event='click' )
    {
        this.type = type;
        this.event = event;
    }

    // assign an arbitrary set of vars. Ex. assign( { canBubble: false } );
    assign( vars )
    {
        for( const key of Object.keys( vars ) )
        {
            this[key] = vars[key];
        }

        return this;
    }

    dispatchClick( elem )
    {
        var clickEvent = document.createEvent( this.type );
        clickEvent.initMouseEvent( this.event,
            this.canBubble, this.cancelable, this.view, this.detail,
            this.screenX, this.screenY, this.clientX, this.clientY,
            this.ctrlKey, this.altKey, this.shiftKey, this.metaKey,
            this.button, this.relatedTarget );

        $( elem )[0].dispatchEvent( clickEvent );
    }
}
