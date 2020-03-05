//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/menu.js
//requires utils.js

var global_defaults =
    {
        css:
        {
            //menu
            body: { padding: 0, margin: 0 },
            menuItems: { padding: '10px' },
            menu: { height: '100%', width: '200px', padding: 0, margin: 0, float: 'left' },
            display: { height: '100%', width: 'calc(100% - 202px)', padding: 0, margin: 0, 'border-left': '2px #000 solid', float: 'left' },
            //menuItem
            menuItem: { cursor: 'pointer', 'margin-bottom': '10px' },
            menuItemHover: { on: { 'background-color': '#CCC' }, off: { 'background-color': '#FFF' } },
            //jsonEditBox
            jsonEdit: { width: '50%', height: '50%', float: 'left' },
            jsonText: { width: '100%', height: 'calc(100% - 50px)', 'white-space': 'nowrap' },
            editBoxHover: { on: { 'background-color': '#EEE' }, off: { 'background-color': '#FFF' } },
            //isJson
            bgWhite: { 'background-color': '#FFF' },
            bgRed: { 'background-color': '#fbcfcf' }
        },
        json:
        {
            settings: { indent: '  ' }
        }
    };
