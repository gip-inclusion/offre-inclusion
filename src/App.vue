<template>
  <div id="app">
    <div id="wrapper">
      <h1>Où sont les trous dans la raquette de l’offre d’insertion ?</h1>
      <myComponent></myComponent>
    </div>
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
      //console.log(store.state.myData)
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
    #wrapper{
      width: 100%;
      max-width: 1020px;
      margin:0 auto;
      padding-top: 50px;
      h1{
      color: #000638;
      font-family:Marianne;
      font-feature-settings: 'liga' off, 'clig' off;
      font-size: 32px;
      font-style: normal;
      font-weight: 700;
      line-height: 40px;
    }
      
    }
    
  }
  
</style>
