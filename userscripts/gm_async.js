class GM_Async
{
  static xmlhttpRequestAsync( url, method='GET' )
  {
      return new Promise( ( resolve, reject ) => {
          GM_xmlhttpRequest( {
              method: method,
              url: url,
              onload: (response) => resolve( response ),
              onerror: (error) => reject( error ),
              // headers, etc.
          } );
      } );
  }

  /*{
      filename: <name to download as>,
      url: <url to download>,
      progress: <null or unset - updated as the file downloads>,
      download: <null or unset - set by the download, includes an abort() method to cancel the download>
  }*/
  static downloadAsync( obj, progressFunc=null )
  {
      if( obj.progress >= 0 )
      {
          return; // prevent double downloading
      }
  
      if( !progressFunc )
      {
          progressFunc = ( obj ) => {};
      }
  
      return new Promise( (resolve, reject) => {
          obj.download = GM_download( {
              url: obj.url,
              name: obj.filename,
              saveAs: true,
              onload: (details) => resolve( details ), // download complete
              onprogress: (data) => {
                  obj.progress = Math.round( ( data.loaded / data.total ) * 100 );
                  progressFunc( obj );
              },
              ontimeout: (error) => {
                  console.error( `Timeout on ${obj.filename} => ${obj.url}` );
                  reject( error );
              },
              onerror: (error) => {
                  console.error( `Error on ${obj.filename} => ${obj.url}` );
                  reject( error );
              }
          } )
      } );
  }
}
