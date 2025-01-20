<template>
  <div id="app">
    <h1>Où sont les trous dans la raquette de l’offre d’insertion ?</h1>
    <myComponent></myComponent>
  </div>
</template>

<script>

import MyComponent from './components/myComponent.vue'
import store from '@/store'
import { getData } from './import.js'

export default {
  name: 'App',
  components: {
    MyComponent
  },

  computed: {
    dataImport() {
      return store.state.endImport
    },
  },

  watch:{
    dataImport:function(){
      
    }
  },
  
  created(){
    getData(store)
  }
}
</script>

<style lang="scss">

  @import "../css/variables.scss";

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
  
</style>
