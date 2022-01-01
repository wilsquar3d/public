//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/PokemonGo/PokemonGoGym.vue

<template>
  <div class='pokemon-gym'>

    <div class='gym-details'>
      <editable-rule-field
        class='field name'
        :type='template["name"]'
        :value='gym.name'
        @changed='dataChanged( "name", ...arguments )'
      />
      <editable-rule-field
        class='field'
        :type='template["city"]'
        :value='gym.city'
        @changed='dataChanged( "city", ...arguments )'
      />
      <editable-rule-field
        class='field latlong'
        :value='gym.latitude'
      />
      <editable-rule-field
        class='field latlong'
        :value='gym.longitude'
      />
      <editable-rule-field
        class='field'
        :type='template["level"]'
        :value='gym.level'
        @changed='dataChanged( "level", ...arguments )'
      />
      <editable-rule-field
        class='field'
        :type='template["priority"]'
        :value='gym.priority'
        @changed='dataChanged( "priority", ...arguments )'
      />

      <button @click='showMap = !showMap'>Show Map</button>
    </div>

    <template v-if='showMap'>
      <pokemon-go-gym-map
        :gym='gym'
      />
    </template>

  </div>
</template>

<script>
  module.exports = 
  {
    data: () => {
      return {
        showMap: false
      };
    },
    props:
    {
      gym: { type: Object, required: true }
    },
    methods:
    {
      dataChanged( field, value )
      {
        this.gym[field] = value;
        this.$emit( 'save' );
      }
    },
    computed:
    {
      template()
      {
        return {
          name: { type: 'label', editable: true },
          city: { type: 'enum', values: [
            '',
            'Guelph',
            'Kitchener',
            'Waterloo',
            'Woodstock',
            'Erin',
            'Cambridge',
            'Breslau',
            'Elmira',
            'Bloomingdale',
            'New Hamburg',
            'Wilmot',
            'Doon',
            'Rockwood'
          ] },
          level: { type: 'enum', values: ['', 'Bronze', 'Silver', 'Gold'] },
          priority: { type: 'integer', range: { min: 0, max: 10 } }
        };
      }
    }
  }
</script>
    
<style>
.pokemon-gym
  {
    width: 100%;
    margin: 2px 10px 2px 0;
    border: 1px solid #000;
    border-radius: 3px;
    padding: 3px;
  }
  .pokemon-gym:hover
  {
    background-color: #CCC;
  }
  .gym-details
  {
  }
  .field
  {
    margin-left: 5px;
  }
  .name
  {
    width: 450px;
  }
  .latlong
  {
    width: 100px;
  }
</style>
