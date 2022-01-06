//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/PokemonGo/PokemonGoGyms.vue

<template>
  <div id='pokemon-gyms'>

    <input type='button' value='Save' @click='save()' />

    {{data.length}}
    {{JSON.stringify( level_stats )}}
    {{JSON.stringify( city_stats )}}

    <pokemon-go-gym
      v-for='gym, ndx in data'
      :key='gym.gym_id'
      :gym='gym'
      @save='save()'
    ></pokemon-go-gym>

  </div>
</template>

<script>
  module.exports =
  {
    data: () => {
      return {
        data: []
      };
    },
    props:
    {
      prop_data: { type: Array, default: null }
    },
    created()
    {
      this.data = this.prop_data;
    },
    methods:
    {
      save()
      {
        this.$emit( 'export', this.data );
      }
    },
    computed:
    {
      level_stats()
      {
        return this.data.reduce( ( acc, item ) => { acc[item.level] = ++acc[item.level] || 1; return acc; }, {} );
      },
      city_stats()
      {
        return this.data.reduce( ( acc, item ) => { acc[item.city] = ++acc[item.city] || 1; return acc; }, {} );
      }
    }
  }
</script>

<style>
  #pokemon-gyms
  {
    width: 100%;
    height: 100%;
    text-align: left;
    display: flex;
    flex-wrap: wrap;
  }
</style>
