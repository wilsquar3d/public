/**************************
  String Modifiers - Start
***************************/
/*
Removes white space from beginning and end of a string.
std:	The string to trim.
Returns trimmed string.
*/
function trim( str )
{
	return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/*
Converts a string to lowercase.
str:	The string to convert.
Returns lowercase string.
*/
function toLow( str )
{
	return str.toLowerCase();
}

/*
Converts a string to uppercase.
str:	The string to convert.
Returns uppercase string.
*/
function toUp( str )
{
	return str.toUpperCase();
}

/*
Remove all occurances of a string from another string.
text:	The original text.
val:	The value to remove from text.
Returns cleaned string
*/
function clean( text, val )
{
	return text.replace( new RegExp( val, 'g' ), '' );
}
/************************
  String Modifiers - End
*************************/

/*******************************
  DOM Access Shorteners - Start
********************************/
/*
Shortens the "document.getElementById( id );" call.
id:		The id attribute value of the DOM element to search for.
doc:	<optional>The document or tag to search.</optional>
Returns a DOM element.
*/
function byId( id, doc )
{
	if( !doc )
	{
		doc = document;
	}
	return document.getElementById( id );
}

/*
Shortens the "document.getElementsByTagName( name );" call.
name:	The tag name of the DOM elements to search for.
doc:	<optional>The document or tag to search.</optional>
Returns an array of DOM elements.
*/
function byTag( name, doc )
{
	if( !doc )
	{
		doc = document;
	}
	return doc.getElementsByTagName( name );
}

function newElem( name )
{
	return document.createElement( name );
}

function newText( val )
{
	return document.createTextNode( val );
}

function newInput( type )
{
	var elem = newElem( "input" );
	setAtt( elem, "type", type );
	return elem;
}

function setAtt( elem, id, val )
{
	elem.setAttribute( id, val );
}

function getAtt( elem, att )
{
	return elem.getAttribute( att );
}

function setId( elem, val )
{
	setAtt( elem, "id", val );
	setAtt( elem, "name", val );
}
/*****************************
  DOM Access Shorteners - End
******************************/

/********************
  DOM Extras - Start
*********************/
/*
Adds a sound file to a DOM element.
id:		The DOM element id value to add the sound object to.
url:	The URL where the sound file can be found.
play:	True/False whether to auto start playing the file.
*/
function playSound( id, url, play )
{
	var sound = newElem( "embed" );
	
	setAtt( sound, "src", url );
	setAtt( sound, "style", "width:0;height:0;" );
	setAtt( sound, "autostart", "false" );
	setAtt( sound, "hidden", "true" );
	setAtt( sound, "loop", "false" );
	setAtt( sound, "volume", "100" );
	
	if( play == true )
	{
		setAtt( sound, "autostart", "true" );
	}
	
	byId( id ).appendChild( sound );
}

function rollUp( elem )
{
	var hInt 	= 5;
	var height	= elem.style.height;
	
	if( height == "" )
	{
		setAtt( elem, "style", "height:"+elem.offsetHeight+"px;" );
	}
	
	height = elem.style.height.split( "px" )[0];
	
	if( height <= ( hInt * 2 ) )
	{
		elem.parentNode.removeChild( elem );
	}
	else
	{
		elem.style.height = ( height-hInt )+"px";
		setTimeout( rollUp ,50, elem );
	}
}
/******************
  DOM Extras - End
*******************/

/*****************
  Sorting - Start
******************/
/*
An array sort function to sort elements in ascending order.
*/
function sort_ascending( a, b )
{
	
}

/*
An array sort function to sort elements in descending order.
*/
function sort_descending( a, b )
{
	
}
/***************
  Sorting - End
****************/

/***********************
  HTTP Requests - Start
************************/
/*
Sends a GET request and processes the response.
url:	The URL to send the request to.
func:	The function to run on the response.
*/
function send_getRequest( url, func )
{
	GM_xmlhttpRequest(
	{
		method: 'GET',
		url: 	url,
		
		headers:
		{
			'User-agent': 	'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 		'application/atom+xml,application/xml,text/xml'
		},
		
		onload: function( response )
		{
			if( func != null )
				func( response.responseText );
		}
	} );
}

/*
Sends a POST request and processes the response.
url:	The URL to send the request to.
data:	The data to send as POST variables.
func:	The function to run on the response.
*/
function send_postRequest( url, data, func )
{
	GM_xmlhttpRequest(
	{
		method: 'POST',
		url: 	url,
		data:	data,
		
		headers:
		{
			"Content-Type": "application/x-www-form-urlencoded"
		},
		
		onload: function( response )
		{
			if( func != null )
				func( response.responseText );
		}
	} );
}
/*********************
  HTTP Requests - End
**********************/

/********************
  DOM Search - Start
*********************/
/*
Searches an array based on an arbitrary attribute and value pair.
list:	The array of DOM elements to search.
attrib:	The attribute name to look for.
value:	The value to match on the attribute attrib.
Returns all equal matches as an array
*/
function search_op( list, attrib, value )
{
	items = new Array();

	for( var i=0; i < list.length; ++i )
	{
		if( val = list[i].getAttribute( attrib ) )
		{
			if( val == value )
			{
				items.push( list[i] );
			}
		}
	}
	return items;
}

//Searches an array based on an arbitrary attribute and value pair for close matches
//Returns all approximate matches as an array
function match_op( list, attrib, value )
{
	items = new Array();

	for( var i=0; i < list.length; ++i )
	{
		if( val = list[i].getAttribute( attrib ) )
		{
			if( val.match( value ) )
			{
				items.push( list[i] );
			}
		}
	}
	return items;
}
/******************
  DOM Search - End
*******************/

/************************
  DOM Operations - Start
*************************/
/*
*Secondary helper with count variable.
Delays execution of a function call on an array of items
list:	The list of items to be passed as parameters to the function.
delay:	The amount to delay between repeated calls.
func:	The function to call on the list of items.
count:	<optional>Initial starting point in the list. Defaults to 0.</optional>
*/
function op_wait( list, delay, func, count )
{
	if( !count )
	{
		count = 0;
	}
	if( count < list.length )
	{
		func( list[count] );
	}
	setTimeout( op_wait, delay, list, delay, func, ++count );
}
/**********************
  DOM Operations - End
***********************/

/*********************
  DOM Actions - Start
**********************/

KeyCode_ESC = 27;

/*
Simulates a mousedown event.
obj:	The DOM object to perform the mousedown action on.
*/
function action_mousedown( obj )
{
	action_mouse( obj, "mousedown" );
}

/*
Simulates a click event.
obj:	The DOM object to perform the click action on.
*/
function action_click( obj )
{
	action_mouse( obj, "click" );
}

/*
*Secondary helper. Simulates a mouse event on a DOM object.
obj:	The DOM object to perform the action on.
action:	The mouse action to perform.
*/
function action_mouse( obj, action )
{
	var evt = document.createEvent( "MouseEvent" );
	evt.initEvent( action, true, true );
	obj.dispatchEvent( evt );
}

/*
Adds a mousedown action to a DOM object. (Can be a Greasemonkey script call)
obj:	The DOM object to add the action to.
func:	The function to call when the action occurs.
*/
function addAction_mousedown( obj, func )
{
	addAction_mouse( obj, func, "mousedown" );
}

/*
Adds a click action to a DOM object. (Can be a Greasemonkey script call)
obj:	The DOM object to add the action to.
func:	The function to call when the action occurs.
*/
function addAction_click( obj, func )
{
	addAction_mouse( obj, func, "click" );
}

/*
Secondary helper. Adds a mouse action to a DOM object. (Can be a Greasemonkey script call)
obj:	The DOM object to add the action to.
func:	The function to call when the action occurs.
action:	The mouse action to add.
*/
function addAction_mouse( obj, func, action )
{
	obj.addEventListener( action, func, false );
}

/*
Adds a key press action to a DOM object. (Can be a Greasemonkey script call)
obj:	The DOM object to add the action to.
func:	The function to call when the action occurs.
*/
function addAction_keypress( obj, func )
{
	addAction_key( obj, func, "keypress" );
}

/*
Removes a key press action to a DOM object. (Can be a Greasemonkey script call)
obj:	The DOM object to remove the action from.
func:	The function to remove.
*/
function removeAction_keypress( obj, func )
{
	removeAction_key( obj, func, "keypress" );
}

/*
Secondary helper. Adds a key action to a DOM object. (Can be a Greasemonkey script call)
obj:	The DOM object to add the action to.
func:	The function to call when the action occurs.
action:	The key action to add.
*/
function addAction_key( obj, func, action )
{
	obj.addEventListener( action, func, false );
}

function removeAction_key( obj, func, action )
{
	obj.removeEventListener( action, func, false );
}

/*******************
  DOM Actions - End
********************/

/***********************************************
  GreaseMonkey Interal Access Variables - Start
************************************************/
/*
Reads a GreaseMonkey variable.
id:		The GreaseMonkey variable identifier.
def:	The default value to use if the variable does not exist.
Returns the stored value or the default value if not found.
*/
function gm_read( id, def )
{
	return GM_getValue( id, def );
}

/*
Writes a value to a GreaseMonkey variable.
id:		The GreaseMonkey variable identifier to use.
val:	The value to add to the variable.
*/
function gm_write( id, val )
{
	GM_setValue( id, val );
}

/*
Writes a value to a GreaseMonkey variable.
id:		The GreaseMonkey variable identifier to use.
obj:	The DOM object to retrieve a value from and add to the variable.
*/
function gm_objectWrite( id, obj )
{
	GM_setValue( id, obj.value );
}
/*********************************************
  GreaseMonkey Interal Access Variables - End
**********************************************/
