//https://raw.githubusercontent.com/wilsquar3d/public/master/userscripts/datetime.js

// props = { hasMs: true, dateDelim: '-', timeDelim: ':', twoDigitMonth: true, twoDigitDay: true, twoDigitHour: true, twoDigitMinute: true, twoDigitSecond: true, fullYear: true }
function timestampToDateTime( timestamp, props={} )
{
    if( !parseInt( timestamp ) )
    {
        return timestamp;
    }

    return `${timestampToDate( timestamp, props )} ${timestampToTime( timestamp, props )}`;
}

function timestampToDate( timestamp, props={} )
{
    let date = new Date( timestamp * ( props.hasMs || true ? 1 : 1000 ) );

    let year = props.fullYear || true ? date.getFullYear() : date.year;
    let month = props.twoDigitMonthDay || true ? zeroPadLeft( date.getMonth() + 1, 2 ) : date.getMonth() + 1;
    let day = props.twoDigitMonthDay || true ? zeroPadLeft( date.getDate(), 2 ) : date.getDate();

    return `${year}${props.dateDelim || '-'}${month}${props.dateDelim || '-'}${day}`;
}

function timestampToTime( timestamp, props={} )
{
    let date = new Date( timestamp * ( props.hasMs || true ? 1 : 1000 ) );

    let hour = props.towDigitHour || true ? zeroPadLeft( date.getHours(), 2 ) : date.getHours();
    let min = props.towDigitMinute || true ? zeroPadLeft( date.getMinutes(), 2 ) : date.getMinutes();
    let sec = props.towDigitSecond || true ? zeroPadLeft( date.getSeconds(), 2 ) : date.getSeconds();

    return `${hour}${props.timeDelim || ':'}${min}${props.timeDelim || ':'}${sec}`;
}

function zeroPadLeft( str, length )
{
    return '0'.repeat( length - str.length ) + str;
}
