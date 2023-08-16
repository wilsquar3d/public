//https://raw.githubusercontent.com/wilsquar3d/public/master/specific/Sierpinski.js
// @require      https://raw.githubusercontent.com/wilsquar3d/public/master/scripts/Geometry.js
// @require      https://raw.githubusercontent.com/wilsquar3d/public/master/scripts/SVG.js

/*
Random dot demo:
$( document.body ).html( '' ).append( $( '<div id="svg"></div>' ) );

let points = [{ x: 1, y: 1 }, { x: 800, y: 1 }, { x: 400, y: 600 }];
SVG.insert( '#svg', SVG.create( { id: 'test', width: '100%', height: '100%' } ) );

let sierpinski = new Sierpinski( points, '#test', 'green' );
sierpinski.start();
let timer = setInterval( addPoints, 100 );

function addPoints( n=1000, max=50000 )
{
    for( var i = 0; i < n; ++i )
    {
        sierpinski.addPoint();
    }

    if( sierpinski.count > max )
    {
        clearInterval( timer );
        sierpinski.cleanup();
    }
}
*/
class Sierpinski
{
    triangle;
    selector;
    fill;
    props;
    startPoint;
    lastPoint;
    count = 0;

    constructor( points, selector, fill, props={} )
    {
        if( 3 != points.length )
        {
            throw 'Points needs to be a triangle (3).';
        }

        this.triangle = points;
        this.selector = selector;
        this.fill = fill;
        this.props = props;

        this.startPoint = this.startLocation();
        this.lastPoint = JSON.parse( JSON.stringify( this.startPoint ) );
    }

    start()
    {
        // triangle
        for( var point of this.triangle )
        {
            SVG.append( this.selector, SVG.point( point.x, point.y, this.fill, this.props ) );
        }

        // starting point
        SVG.append( this.selector, SVG.point( this.startPoint.x, this.startPoint.y, this.fill, this.props ) );
    }

    startLocation()
    {
        if( this.startPoint )
        {
            return this.startPoint;
        }

        let r1 = Math.sqrt( Math.random() );
        let r2 = Math.random();

        let x = ( 1 - r1 ) * this.triangle[0].x + ( r1 * ( 1 - r2 ) ) * this.triangle[1].x + ( r1 * r2 ) * this.triangle[2].x;
        let y = ( 1 - r1 ) * this.triangle[0].y + ( r1 * ( 1 - r2 ) ) * this.triangle[1].y + ( r1 * r2 ) * this.triangle[2].y;

        return { x: x, y: y };
    }

    addPoint()
    {
        let next = this.triangle[Math.floor( Math.random() * 3 )];

        this.lastPoint = {
            x: ( this.lastPoint.x + next.x ) / 2.0,
            y: ( this.lastPoint.y + next.y ) / 2.0
        };

        SVG.append( this.selector, SVG.point( this.lastPoint.x, this.lastPoint.y, this.fill, this.props ) );

        ++this.count;
    }

    // First few points could be incorrect while the pattern establishes itself.
    cleanup( num=10 )
    {
        for( var i = 0; i < num; ++i )
        {
            $( this.selector ).find( 'circle' ).first().remove();
        }
    }
}
