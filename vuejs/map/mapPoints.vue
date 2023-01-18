//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/map/mapPoints.vue
// @require      https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/build/ol.js
// @resource     https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/css/ol.css
/*
	const script = document.createElement( 'script' );
	script.setAttribute( 'type', 'text/javascript' );
	script.setAttribute( 'src', 'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/build/ol.js' );
	document.head.appendChild( script );

	const style = document.createElement( 'link' );
	style.setAttribute( 'type', 'text/css' );
	style.setAttribute( 'rel', 'stylesheet' );
	style.setAttribute( 'href', 'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/css/ol.css' );
	document.head.appendChild( style );
*/

<template>
	<div class='map-wrap' :style='"height:" + height'>
		<div :id='uniqueId' class='map' ref='map'></div>
	</div>
</template>

<script>
	module.exports =
	{
		name: 'MapPoints',
		data: () => {
			return {
				map: null,
				style: null,
				layerMarkers: null
			};
		},
		props:
		{
			height: { type: String, default: '100vh' },
			zoom: { type: Number, default: 10 },
			markers: { type: Array, default: [] },
			icon: { type: String, default: null },
			icon_scale: { type: Number, default: 1 }
		},
		mounted()
		{
			if( this.isLibReady() )
			{
				this.createMap();
				this.createStyle();
				this.createMarkersLayer();
				this.createMarkers();
			}
		},
		methods:
		{
			isLibReady()
			{
				if( !ol )
				{
					console.log( 'Open Layers library not found!' );
				}
				
				return !!ol;
			},
			createMap()
			{
				this.map = new ol.Map( {
					target: this.uniqueId,
					layers: [ new ol.layer.Tile( { source: new ol.source.OSM() } ) ],
					view: new ol.View( {
						center: this.center,
						zoom: this.zoom
					} )
				} );
			},
			createStyle()
			{
				if( this.icon )
				{
					this.style = new ol.style.Style( {
						image: new ol.style.Icon( {
							anchor: [0, 0],
							src: this.icon,
							scale: this.icon_scale
						} ),
						text: new ol.style.Text( {
							font: 'bold 10px Calibri,sans-serif',
							fill: new ol.style.Fill( {
								color: 'black'
							} ),
							stroke: new ol.style.Stroke( {
								color: 'white',
								width: 2,
							} )
						} )
					} );
				}
			},
			createMarkersLayer()
			{
				this.layerMarkers = new ol.layer.Vector( {
					source: new ol.source.Vector( {
						features: [],
						style: function( feature ) {
							style.getText().setText( feature.get( 'name' ) );
							return style;
						}
					} )
				} );

				this.map.addLayer( this.layerMarkers );
			},
			createMarkers()
			{
				for( const mark of this.markers )
				{
					let marker = new ol.Feature( {
						geometry: new ol.geom.Point( this.createPoint( mark ) ),
						name: mark.name
					} );
					
					if( this.style )
					{
						marker.setStyle( this.style );
					}

					this.addMarkerToMap( marker );
				}
			},
			addMarkerToMap( marker )
			{
				this.layerMarkers.getSource().addFeature( marker );
			},
			createPoint( point )
			{
				return ol.proj.fromLonLat( [ point.longitude, point.latitude ] );
			}
		},
		computed:
		{
			uniqueId()
			{
				return ( 'map-wrap_' + this.markers[0].latitude + '_' + this.markers[0].longitude ).replaceAll( '.', '' );
			},
			center()
			{
				let lat_min = Math.min( ...this.markers.map( x => x.latitude ) );
				let lat_max = Math.max( ...this.markers.map( x => x.latitude ) );
				let lng_min = Math.min( ...this.markers.map( x => x.longitude ) );
				let lng_max = Math.max( ...this.markers.map( x => x.longitude ) );

				return ol.proj.fromLonLat( [ ( lng_min + lng_max ) / 2.0, ( lat_min + lat_max ) / 2.0 ] );
			}
		}
	}
</script>

<style>
	.map-wrap
	{
		width: 100%;
		border: 1px solid #000;
	}
	.map
	{
		width: 100%;
		height: 100%;
	}
	.ol-attribution
	{
		display: none;
	}
</style>
    
