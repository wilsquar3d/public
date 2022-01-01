//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/map/mapPoint.vue
// @require      https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/build/ol.js
// @resource     https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/css/ol.css
/*
	const script = document.createElement( 'script' );
	script.setAttribute( 'type', 'text/javascript' );
	script.setAttribute( 'src', 'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/build/ol.js' );
	script.async = true;
	document.head.appendChild( script );

	const style = document.createElement( 'link' );
	style.setAttribute( 'type', 'text/css' );
	style.setAttribute( 'rel', 'stylesheet' );
	style.setAttribute( 'href', 'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/css/ol.css' );
	style.async = true;
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
		name: 'MapPoint',
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
			latitude: { type: [Number, String], required: true },
			longitude: { type: [Number, String], required: true },
			zoom: { type: Number, default: 15 },
			markers: { type: Array, default: [] }, //TODO validate lat/lng list
			icon: { type: String, default: null },
			iconScale: { type: Number, default: 1 }
		},
		mounted()
		{
			console.log( ol );
			if( this.isLibReady() )
			{
				this.createMap();
				this.createStyle();
				this.createMarkersLayer();
				this.createCenterMarker();
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
							scale: this.iconScale
						} )
					} );
				}
			},
			createMarkersLayer()
			{
				this.layerMarkers = new ol.layer.Vector( {
					source: new ol.source.Vector( {
						features: [],
						style: this.style
					} )
				} );

				this.map.addLayer( this.layerMarkers );
			},
			createCenterMarker()
			{
				var marker = new ol.Feature( {
					geometry: new ol.geom.Point( this.center )
				} );

				if( this.style )
				{
					marker.setStyle( this.style );
				}

				this.addMarkerToMap( marker );
			},
			addMarkerToMap( marker )
			{
				this.layerMarkers.getSource().addFeature( marker );
			}
		},
		computed:
		{
			uniqueId()
			{
				return ( 'map-wrap_' + this.latitude + '_' + this.longitude ).replaceAll( '.', '' );
			},
			center()
			{
				return ol.proj.fromLonLat( [ this.longitude, this.latitude ] );
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
    
