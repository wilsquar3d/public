//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/download.js

// menuItems: list to add menu items to
function imagesViewAndDownload( menuItems, viewTitleFunc=null, downloadTitleFunc=null )
{
    let gmKeys = GM_listValues();

    for( const key of gmKeys )
    {
        let tempData = GM_getValue( key, null );

        if( tempData )
        {
            menuItems.push( menuItem( viewTitleFunc( key ), { func: imagesDownloadPage, props: { key: key, title: key } } ) );
            menuItems.push( menuItem( downloadTitleFunc( key ), { func: imagesDownloadPage, props: { key: key, title: key, showAll: 10 } } ) );
        }
    }
}

// props: { key: <gm data id>, title: <optional>, showAll: <optional true|number>, addExt: <optional true|false>, nameKey: <optional string>, imgKey: <optional string> }
function imagesDownloadPage( id, props )
{
    let tempData = GM_getValue( props.key, {} );
    let dlData = Object.keys( tempData ).reduce( (acc, key) => { acc[props.nameKey ? tempData[key][nameKey] : key] = tempData[key][props.imgKey || 'image']; return acc; }, {} ); // name: image url

    display_imagesDownloadPage( id, dlData, props.title || id, props.showAll || true, props.addExt || false );
}

// Can show a limited number of images (#), all (true) or none (false)
function display_imagesDownloadPage( id, imgs, name, showImgs=true, addExt=true, type='image/png' )
{
    let keys = Object.keys( imgs );

    $( id )
        .append( $( '<div style="font-size:24pt;padding:10px;margin:20px;background-color:lightgrey;">' + name + ' (' + keys.length + ')</div>' )
            .append( $( '<input type="button" value="Download All" style="margin-left: 10px;" />' ).click( async function(){ await downloadAll( imgs, type, addExt ); } ) ) );

    if( showImgs )
    {
        let limit = parseInt( showImgs ) || keys.length;
        let cnt = 0;

        $.each( keys,
            function( ndx, key )
            {
                $( id ).append( '<img style="max-height:100px;" title="' + key + '" src="' + imgs[key] + '" />' );

                if( ++cnt == limit )
                {
                    return false;
                }
            }
        );
    }
}

async function downloadAll( elems, type='image/png', addExt=true )
{
    for( let name in elems )
    {
        let url = elems[name];

        if( addExt )
        {
            name += '.' + url.split( '?' )[0].split( '#' )[0].split( '.' ).pop();
        }

        await downloadImageFile( name, url, type );
    }
}

async function downloadImageFile( filename, url, type='image/png' )
{
    return new Promise( (resolve, reject) => {
        GM_xmlhttpRequest(
            {
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: function( response )
                {
                    if( 200 == response.status )
                    {
                        var data = new Blob( [new Uint8Array( response.responseText.split( '' ).map( ch => ch.charCodeAt( 0 ) ) )], { type: type } );
                        var fileURL = window.URL.createObjectURL( data );

                        const link = document.createElement( 'a' );
                        link.href = fileURL;
                        link.setAttribute( 'download', filename );
                        document.body.appendChild( link );
                        link.click();
                        link.remove();

                        window.URL.revokeObjectURL( fileURL );

                        resolve( response.responseText );
                    }
                    else
                    {
                        reject( response );
                    }
                },
                onerror: function( error )
                {
                    reject( error );
                }
            }
        );
    } );
}

/////////////////////////////////////////////////////////////////////////////////////////

class ImagesDisplay
{
    id = null;
    photosId = 'updatePhotos';
    default = {
        showAll: 50,
        pagination: 50,
        props: {
            key: null, // gm data id
            imagesKey: null, // prop name of images object
            keepKey: 'keep',
            hideKey: 'hidden',

            prop: {
                img: 'image', // supports single depth: "url" or multi-depth: "first.second.third"
                link: null, // image link if separate to the image url
                saved: 'saved',
                cache: 'cache', // (preferred) base64 image property
                name: null, // name property
                sort: null, // sort field
                sortFunc: null, // sort wrapping function
                // TODO link has 2 meanings!!!!!!!!!!!!!!!!!!
                link: null, // prop name of image link
            },

            loadData: false, // load the data variable with GM data
            showAll: true, // true|false|number
            showAllIncludeCached: false,
            showAllIncludeSaved: false,
            deleteKeepKeys: false, // delete removes object properties, but keeps keys
            linkFullSize: true,

            titlebar: {
                title: null,
                downloadAll: false,
                deleteAll: false,
                hideAll: false,
                keepAll: false,
                cacheAll: false,
                reloadAll: false,
                filterCount: false,
                customSubTitle: null,
            },

            showButtons: {
                keep: true,
                hide: true,
                reload: true,
                cache: true,
                download: true,
                link: true,
                delete: true,
            },

            maxHeight: '100px',

            // more
            addExt: false, // true if downloaded images need an extension added
            type: 'image/png',
            pagination: false, // true|false|number
        }
    };
    html = {
        id: {
            downloadAll: 'check_downloadAll',
            deleteAll: 'check_deleteAll',
            hideAll: 'check_hideAll',
            keepAll: 'check_keepAll',
            cacheAll: 'check_cacheAll',
            reloadAll: 'check_reloadAll',
        },
        cls: {
            imageWrap: 'imgWrap',
            image: 'ww_image_ww',
        }
    };
    props = null;

    static defaultProps( id, title, size=50 )
    {
        return {
            key: id,
            imagesKey: 'images',
            loadData: true,
            prop: {
                img: 'uri',
                link: 'url',
            },
            showAll: size,
            titlebar: {
                title: title,
                hideAll: true,
                keepAll: true,
                reloadAll: true,
            },
            deleteKeepKeys: true,
            showButtons: { delete: false },
            maxHeight: '300px'
        };
    }

    static defaultKeepProps( id, title, size=50 )
    {
        return {
            key: id,
            imagesKey: 'keep',
            loadData: true,
            prop: {
                img: 'uri',
                link: 'url',
            },
            showAll: size,
            titlebar: {
                title: title + ' - Keep',
                hideAll: true,
                cacheAll: true,
                downloadAll: true,
                filterCount: true,
                reloadAll: true,
            },
            deleteKeepKeys: true,
            showButtons: { keep: false },
            maxHeight: '300px'
        };
    }

    static defaultHideProps( id, title, size=50 )
    {
        return {
            key: id,
            imagesKey: 'hidden',
            loadData: true,
            prop: {
                img: 'uri',
                link: 'url',
            },
            showAll: size,
            titlebar: {
                title: title + ' - Hide',
                keepAll: true,
                deleteAll: true,
            },
            deleteKeepKeys: true,
            showButtons: { hide: false },
            maxHeight: '300px'
        };
    }

    // get the next URL from another URL
    static reloadNextUrl( url )
    {
        let next = url.split( 'reloadNext=' )[1].split( '&' )[0]; // data key

        // get next saved URL
        let urls = GM_getValue( next, null );
        let nextUrl = urls.length ? urls.shift() + `&count=${urls.length}` : null;

        GM_setValue( next, urls );

        return nextUrl;
    }

    // open the next URL from another URL
    static reloadNextOpen( url, bFirst=false )
    {
        let nextUrl = ImagesDisplay.reloadNextUrl( url );

        if( nextUrl )
        {
            window.location.href = nextUrl;
            return;
        }

        window.close();
    }

    constructor( props )
    {
        props = this.mapProps( copyJson( this.default.props ), props );

        // set default showAll size if set to true
        if( props.showAll === true )
        {
            props.showAll = this.default.showAll;
        }

        // set default pagination size if set to true
        if( props.pagination === true )
        {
            props.pagination = this.default.pagination;
        }

        this.props = props;
    }

    mapProps( base, override )
    {
        for( let key in override )
        {
            if( isObject( base[key] ) )
            {
                base[key] = this.mapProps( base[key], override[key] );
            }
            else
            {
                base[key] = override[key];
            }
        }

        return base;
    }

    display( id )
    {
        this.id = id;
        this.downloadPage();
    }

    downloadPage()
    {
        let tempData = this.getCategoryData( this.props.loadData, true ); // force reload required for page changes

        // name: { img: url, key: key, [cacheKey]: cache, [savedKey]: isSaved }
        let dlData = Object.keys( tempData ).reduce(
            ( acc, key ) => {
                let record = {
                    img: jsonPath( tempData[key], this.props.prop.img ),
                    key: key,
                };

                if( this.props.prop.sort )
                {
                    record.sort = jsonPath( tempData[key], this.props.prop.sort );
                }

                if( record.img )
                {
                    if( tempData[key][this.props.prop.cache] )
                    {
                        record[this.props.prop.cache] = tempData[key][this.props.prop.cache];
                    }

                    if( tempData[key][this.props.prop.saved] )
                    {
                        record[this.props.prop.saved] = tempData[key][this.props.prop.saved];
                    }

                    acc[this.props.prop.name ? tempData[key][this.props.prop.name] : key] = record;
                }

                return acc;
            },
            {}
        );

        let subTitle = null;

        if( this.props.titlebar.filterCount )
        {
            subTitle = this.pageFilterCount( tempData );
        }
        else if( this.props.titlebar.customSubTitle )
        {
            subTitle = this.props.titlebar.customSubTitle;
        }

        this.createPage( dlData, subTitle );
    }

    createPage( imgs, subTitle=null )
    {
        $( this.id ).append( this.buildTitleBar( imgs, subTitle ) );

        if( !this.props.showAll )
        {
            return;
        }

        let keys = Object.keys( imgs );

        if( this.props.prop.sort )
        {
            keys.sort( this.props.prop.sortFunc( imgs ) ); // sort function is a wrapper to accept imgs and returns the actual sorter
        }
        else
        {
            keys.reverse();
        }

        let limit = parseInt( this.props.showAll ) || keys.length;
        let cnt = 0;

        for( let key of keys )
        {
            // saved images not shown
            if( !this.props.showAllIncludeSaved && imgs[key][this.props.prop.saved] )
            {
                continue;
            }

            let isCached = !!imgs[key][this.props.prop.cache];
            let imgSrc = isCached ? ( 'data:image/png;base64,' + imgs[key][this.props.prop.cache] ) : imgs[key].img; // .img assured from imgs list

            if( !imgSrc )
            {
                continue;
            }

            let nextImg = $( `<div class='${this.html.cls.imageWrap}' style='display:inline-block;'></div>` );
            let img = $( `<img id='${key}' class='${this.html.cls.image}' style='max-height:${this.props.maxHeight};' title='${key}' src='${imgSrc}' />` );

            if( this.props.linkFullSize )
            {
                nextImg.append(
                    $( `<div style='cursor: pointer;'></div>` )
                    .append( img )
                    .click( function() {
                        let w = window.open( 'about:blank' );
                        let image = $( `<img src='${imgSrc}' style='max-height: 100vh;' />` )
                        .click( function() {
                            let height = $( this ).css( 'max-height' );
                            $( this ).css( 'max-height', 'none' == height ? '100vh' : '' );
                        } );
                        setTimeout( function() {
                            $( w.document ).find( 'body' )
                                .attr( 'style', 'margin: 0; padding: 0; text-align: center;' )
                                .append( image );
                        }, 0 );
                    } )
                );
            }
            else
            {
                nextImg.append( img );
            }

            let buttons = [];
            if( this.props.showButtons.keep )
            {
                buttons.push( $( `<img style='cursor: pointer;margin-left: 2px;' src='${icon_check}' title='keep' />` ).click( $.proxy( function(){ this.keepImage( key ); }, this ) ) ); // proxy overrides jQuery 'this' context
            }

            if( this.props.showButtons.hide )
            {
                buttons.push( $( `<img style='cursor: pointer;margin-left: 2px;' src='${icon_x}' title='hide' />` ).click( $.proxy( function(){ this.hideImage( key ); }, this ) ) );
            }

            if( this.props.showButtons.reload )
            {
                buttons.push( $( `<img style='cursor: pointer;margin-left: 2px;' src='${icon_reload}' title='reload' />` ).click( $.proxy( function(){ this.reloadImage( key ); }, this ) ) );
            }

            if( this.props.showButtons.cache && !isCached )
            {
                buttons.push( $( `<img style='cursor: pointer;margin-left: 2px;' src='${icon_download}' title='cache' />` ).click( $.proxy( function(){ this.cacheImage( key ); }, this ) ) );
            }

            if( this.props.showButtons.download )
            {
                buttons.push( $( `<img style='cursor: pointer;margin-left: 2px;' src='${icon_downloadCloud}' title='download' />` ).click( $.proxy( function(){ this.downloadImage( key ); }, this ) ) );
            }

            if( this.props.showButtons.link && this.props.prop.link )
            {
                buttons.push( $( `<img style='cursor: pointer;margin-left:2px;' src='${icon_link}' title='link' />` ).click( $.proxy( function(){ this.linkImage( key ); }, this ) ) );
            }

            if( this.props.showButtons.delete )
            {
                buttons.push( $( `<img style='cursor: pointer;margin-left: 2px;' src='${icon_garbageCan}' title='delete' />` ).click( $.proxy( function(){ this.deleteImage( key ); }, this ) ) );
            }

            if( buttons.length )
            {
                nextImg.append( buttons );
            }

            $( this.id ).append( nextImg );

            // cached not included in the displayed count
            if( !this.props.showAllIncludeCached && isCached )
            {
                continue;
            }

            if( ++cnt == limit )
            {
                break;
            }
        }
    }

    buildTitleBar( imgs, subTitle=null )
    {
        let titleBar = $( `<div style='font-size:24pt;padding:10px;background-color:lightgrey;'>${this.props.titlebar.title || this.id} (${Object.keys( imgs ).length})${subTitle ? ` [${subTitle}]` : ''}</div>` );

        if( this.props.titlebar.downloadAll )
        {
            titleBar.append( [
                $( `<input type='button' value='Download All' style='margin-left: 10px; vertical-align: middle;' />` ).click( $.proxy( function(){ this.downloadAllImages(); }, this ) ),
                $( `<input type='checkbox' id='${this.html.id.downloadAll}' title='include not visible' style='vertical-align: bottom; margin-bottom: 5px; vertical-align: middle;' />` )
            ] );
        }

        if( this.props.titlebar.deleteAll )
        {
            titleBar.append( [
                $( `<input type='button' value='Delete All' style='margin-left: 10px; vertical-align: middle;' />` ).click( $.proxy( function(){ this.deleteAllImages(); }, this ) ),
                $( `<input type='checkbox' id='${this.html.id.deleteAll}' title='include not visible' style='vertical-align: bottom; margin-bottom: 5px; vertical-align: middle;' />` )
            ] );
        }

        if( this.props.titlebar.hideAll )
        {
            titleBar.append( [
                $( `<input type='button' value='Hide All' style='margin-left: 10px; vertical-align: middle;' />` ).click( $.proxy( function(){ this.hideAllImages(); }, this ) ),
                $( `<input type='checkbox' id='${this.html.id.hideAll}' title='include not visible' style='vertical-align: bottom; margin-bottom: 5px; vertical-align: middle;' />` )
            ] );
        }

        if( this.props.titlebar.keepAll )
        {
            titleBar.append( [
                $( `<input type='button' value='Keep All' style='margin-left: 10px; vertical-align: middle;' />` ).click( $.proxy( function(){ this.keepAllImages(); }, this ) ),
                $( `<input type='checkbox' id='${this.html.id.keepAll}' title='include not visible' style='vertical-align: bottom; margin-bottom: 5px; vertical-align: middle;' />` )
            ] );
        }

        if( this.props.titlebar.cacheAll )
        {
            titleBar.append( [
                $( `<input type='button' value='Cache All' style='margin-left: 10px; vertical-align: middle;' />` ).click( $.proxy( function(){ this.cacheAllImages(); }, this ) ),
                $( `<input type='checkbox' id='${this.html.id.cacheAll}' title='include not visible' style='vertical-align: bottom; margin-bottom: 5px; vertical-align: middle;' />` )
            ] );
        }

        if( this.props.titlebar.reloadAll )
        {
            titleBar.append( [
                $( `<input type='button' value='Reload' style='margin-left: 10px; vertical-align: middle;' />` ).click( $.proxy( function(){ this.reloadImages(); }, this ) ),
                $( `<input type='checkbox' id='${this.html.id.reloadAll}' title='include not visible' style='vertical-align: bottom; margin-bottom: 5px; vertical-align: middle;' />` )
            ] );
        }

        let titleWrapper = $( '<div style="position: sticky;top: 0;padding: 20px;background: #FFF;"></div>' );
        titleWrapper.append( titleBar );

        return titleWrapper;
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    keepAllImages()
    {
        let imgs = this.getAllImageKeys( this.html.id.keepAll );

        for( let imgKey of imgs )
        {
            this.keepImage( imgKey, false );
        }

        GM_setValue( this.props.key, data );
    }

    hideAllImages()
    {
        let imgs = this.getAllImageKeys( this.html.id.hideAll );

        for( let imgKey of imgs )
        {
            this.hideImage( imgKey, false );
        }

        GM_setValue( this.props.key, data );
    }

    async cacheAllImages()
    {
        let tempData = this.getCategoryData();
        let imgs = this.getAllImageKeys( this.html.id.cacheAll ).filter( x => !tempData[x][this.props.prop.cache] );
        let ndx = 0;

        for( let imgKey of imgs )
        {
            console.log( `${++ndx} of ${imgs.length} ${imgKey}` );

            await this.cacheImage( imgKey );
        }

        console.log( 'Caching complete' );
    }

    async reloadImages()
    {
        let tempData = this.getCategoryData();
        let imgs = this.getAllImageKeys( this.html.id.reloadAll ).filter( x => !tempData[x][this.props.prop.saved] );
        let num = imgs.length;
        let ndx = 0;
        let links = imgs.map( key => { let [field, record] = this.getPhotoLocation( key ); return this.reloadUrl( record, ++ndx, num ); } );
        let url = null;

        let temp = GM_getValue( 'reloadKey', [] );

        if( !temp.length )
        {
            url = links.shift();
        }

        temp.push( ...links );
        GM_setValue( 'reloadKey', temp );

        if( !temp.length )
        {
            window.open( url, 'reloadingPage' );
        }

        /*
            If you want the opened page to automatically close itself, include in an appropriate location:
            if( window.location.href.includes( '&reloading=true' ) )
            {
                ImagesDisplay.reloadNextOpen( window.location.href );
            }
        */
    }

    // TODO support delays?
    async downloadAllImages( props, markSaved=true, saveData=true )
    {
        let tempData = this.getCategoryData();
        let imgs = this.getAllImageKeys( this.html.id.downloadAll ).filter( x => !tempData[x][this.props.prop.saved] );

        for( let imgKey of imgs )
        {
            await this.downloadImage( imgKey, markSaved, false );
        }

        if( saveData )
        {
            GM_setValue( this.props.key, data );
        }
    }

    deleteAllImages()
    {
        if( this.props.deleteKeepKeys )
        {
            let imgs = this.getAllImageKeys( this.html.id.deleteAll );

            for( let imgKey of imgs )
            {
                this.deleteImage( imgKey, false );
            }
        }
        else
        {
            let tempData = this.getCategoryData();

            tempData = {}; // TODO verify this works
        }

        GM_setValue( this.props.key, data );
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    keepImage( key, saveData=true )
    {
        this.moveImage( key, this.props.keepKey, saveData );
    }

    hideImage( key, saveData=true )
    {
        this.moveImage( key, this.props.hideKey, saveData );
    }

    moveImage( key, whereTo, saveData=true )
    {
        if( !key || !whereTo )
        {
            throw `Cannot move img '${key}' to '${whereTo}'`;
        }

        let refData = this.getCategoryData();

        if( data[whereTo] )
        {
            data[whereTo][key] = refData[key]; //copyJson( refData[key], true );

            delete refData[key];

            if( saveData )
            {
                GM_setValue( this.props.key, data );
            }

            $( `#${key}` ).closest( `div.${this.html.cls.imageWrap}` ).remove();
        }
    }

    reloadUrl( record )
    {
        return ( record[this.props.prop.link || this.props.prop.img] ) + '&reloading=true&reloadNext=reloadKey';
    }

    async reloadImage( key, multi=false, ndx=null, total=null )
    {
        return new Promise( async (resolve, reject) => {
            let [field, record] = this.getPhotoLocation( key );
            let url = this.reloadUrl( record, ndx, total );

            window.open( url, key );
        } );
    }

    async cacheImage( key )
    {
        let [field, record] = this.getPhotoLocation( key );
        let [request, response] = await ProxyNodeCommand.urlCache( record[this.props.prop.image] );
        let json = JSON.parse( response.responseText );

        if( 200 == json.status_code && 0 == json.error.length )
        {
            // record.cache = json.text;
            // GM_setValue( props.key, data );

            console.log( `${this.props.key} ${key} cached` );
            console.log( json.text );
        }
        else
        {
            // console.log( response );
            console.log( json );
        }
    }

    async downloadImage( key, markSaved=true, saveData=true )
    {
        let [field, record] = this.getPhotoLocation( key );
        let name = record[this.props.prop.img].split( '?' )[0].split( '#' )[0].split( '/' ).pop(); // TODO handle no extension?

        await downloadImageFile( name, record[this.props.prop.img] ); // TODO make generic location

        if( markSaved )
        {
            record[this.props.prop.saved] = true;
        }

        if( saveData )
        {
            GM_setValue( this.props.key, data );
        }
    }

    linkImage( key )
    {
        let [field, record] = this.getPhotoLocation( key );

        window.open( record[this.props.prop.link || this.props.prop.img], key );
    }

    deleteImage( key, update=true )
    {
        let tempData = this.getCategoryData();

        if( this.props.deleteKeepKeys )
        {
            tempData[key] = {};
        }
        else
        {
            delete tempData[key];
        }

        if( update )
        {
            GM_setValue( this.props.key, data );
        }

        $( `#${key}` ).closest( `div.${this.html.cls.imageWrap}` ).remove();
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    getPhotoLocation( id )
    {
        let fields = [this.props.imagesKey, this.props.keepKey, this.props.hideKey].filter( x => !!x ); // filter any pages/groups that aren't configured

        for( let field of fields )
        {
            let record = data[field][id];

            if( record )
            {
                return [field, record];
            }
        }

        return [fields[0], null];
    }

    getCategoryData( forceReload=false )
    {
        data = ( forceReload || !data ) ? GM_getValue( this.props.key, {} ) : data;

        let tempData = data;
        if( this.props.imagesKey )
        {
            tempData = tempData[this.props.imagesKey];
        }

        if( !this.props.loadData )
        {
            data = null;
        }

        return tempData;
    }

    pageFilterCount( obj )
    {
        switch( this.props.imagesKey )
        {
            case this.props.keepKey:
                return Object.values( obj ).filter( x => x[this.props.prop.saved] ).length; // number of saved
            case this.props.hideKey:
                return Object.values( obj ).filter( x => !x[this.props.prop.img] ).length; // number of deleted
        }

        return null;
    }

    getAllImageKeys( id=null, leaveDataLoaded=true )
    {
        let visibleOnly = !id || ( $( `#${id}` ).length && !$( `#${id}` ).is(':checked') );

        if( visibleOnly )
        {
            let keys = [];
            $( `img.${this.html.cls.image}` ).each( function() { keys.push( $( this ).attr( 'id' ) ); } );

            return keys;
        }

        return Object.keys( this.getCategoryData( leaveDataLoaded ) );
    }
}

