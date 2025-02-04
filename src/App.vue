<template>
  <div id="app">
    <div id="wrapper">

      <h1>Où sont les trous dans la raquette de l’offre d’insertion ?</h1>

      <div id="pages_controler">
        <div class="page_btn" @click="(page='ensemble')" :class="page=='ensemble'?'active':''">Vision d'ensemble</div>
        <div class="page_btn" @click="(page='zoom')" :class="page=='ensemble'?'':'active'">Zoom sur les données</div>
      </div>

      <vueTerritoire v-if="page=='ensemble'" class="datavue"></vueTerritoire>
      <vueTableau v-if="page=='zoom'" class="datavue"></vueTableau>

    </div>
  </div>
</template>

<script>

import VueTerritoire from './components/vueTerritoire.vue'
import VueTableau from './components/vueTableau.vue'
import store from '@/store'
import { getData } from './import.js'

export default {
  name: 'App',
  components: {
    VueTerritoire,
    VueTableau
  },
  data(){
    return {
      "page":"zoom"
    }
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
        font-size: 32px;
        font-style: normal;
        font-weight: 700;
        line-height: 40px;
        margin-bottom:25px;
      }
      #pages_controler{
        display: flex;
        width: 374px;
        height: 56px;
        text-align: center;
        cursor: pointer;
        margin-bottom: 25px;;
        .page_btn{
          width: 50%;
          color:#000638;
          font-family:Marianne;
          font-size: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          &.active{
            color:#000091;
            border-bottom:2px solid #000091;
          }
        }
      }
      .intro{
        color:#000638;
        font-family: Marianne;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
      }
      .datavue{
        h2{
          color: #000638;
          font-family:Marianne;
          font-size: 24px;
          font-style: normal;
          font-weight: 700;
          line-height: 32px;
          margin-bottom: 35px;
          margin-top: 25px;
        }
        .filters_selector{
          margin-bottom: 25px;
          h4{
            color: #000638;
            font-family:Marianne;
            font-size: 18px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px;
            margin-bottom: 10px;
          }
          .filters_box{
            display: inline-flex;
            padding: 4px 8px 4px 12px;
            justify-content: center;
            align-items: center;
            background: #F2F3F5;
            gap: 8px;
            font-family: Marianne;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            border-radius: 365px;
          }
        }
      }
    }
    
  }
  
</style>
