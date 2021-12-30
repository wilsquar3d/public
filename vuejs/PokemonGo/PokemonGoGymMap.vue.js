//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/PokemonGo/PokemonGoGymMap.vue

components = components || {};

components['pokemon-go-gym-map'] = {
        template: `
	<div id='gym-map-wrap'>

        <map-point-component
            v-if='imageLoaded'
            :height='mapHeight'
            :latitude='gym.latitude'
            :longitude='gym.longitude'
            :icon='iconGym'
            :iconScale='iconScale'
        />

        <template v-if='gym.url'>
            <img class='image' :src='gym.url' :alt='gym.url' @load='onImageLoaded' />
        </template>

        <component is='style'>
			#gym-map-wrap
            {
                width: calc( 100% - 20px );
                max-height: 80vh;
                display: flex;
                margin: 10px;
            }
            .image
            {
                padding-left: 10px;
                max-width: 50%;
                max-height: {{mapHeight}};
            }
		</component>
	</div>
	`,
        data: () => {
            return {
                iconGym: 'https://kwcg.pokegta.com/static/sprites/gym/ingame/gym/0.png',
                iconScale: 0.5,
                mapHeight: 'calc( (100vh * .8) - 20px )',
                imageLoaded: false
            };
        },
        props:
        {
            gym: { type: Object, required: true }
        },
        methods:
        {
            onImageLoaded()
            {
                this.imageLoaded = true;
            }
        }
    };
