//https://raw.githubusercontent.com/wilsquar3d/public/master/scripts/SVG.js

class SVG
{
    static tag( tag )
    {
        // Cannot use jQuery to create SVG elements
        // https://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
        return document.createElementNS( 'http://www.w3.org/2000/svg', tag );
    }

    static create( props={} )
    {
        let svg = SVG.tag( 'svg' );
        SVG.applyProps( svg, props );

        return svg;
    }

    static insert( selector, svg )
    {
        $( selector )[0].appendChild( svg );
    }

    static append( selector, elem )
    {
        $( selector )[0].appendChild( elem );
    }

    static point( x, y, fill, props={} )
    {
        return SVG.circle( 1, x, y, fill, props );
    }

    static circle( r, cx, cy, fill, props={} )
    {
        let circle = SVG.tag( 'circle' );
        SVG.applyProps( circle, { r: r, cx: cx, cy: cy, fill: fill } );
        SVG.applyProps( circle, props );

        return circle;
    }

    static triangle( p1, p2, p3, fill, props={} )
    {
        return SVG.polygon( [p1, p2, p3], fill, props );
    }

    static polygon( points, fill, props={})
    {
        let polygon = SVG.tag( 'polygon' );
        SVG.applyProps( polygon, { points: points.map( p => `${p.x} ${p.y}` ).join( ',' ), fill: fill } );
        SVG.applyProps( polygon, props );

        return polygon;
    }

    static applyProps( obj, props )
    {
        for( var key in props )
        {
            obj.setAttribute( key, props[key] );
        }
    }
}
