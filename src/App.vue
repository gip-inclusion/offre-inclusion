<template>
  <div id="app">
    <div id="wrapper">

      <h1>L’offre d’insertion est-elle bien répartie sur mon territoire ?</h1>

      <div class="intro">
        <h2>Informations sur ce tableau</h2>
        Cet outil vous accompagne dans l'analyse de l'offre d'insertion sur un territoire donné afin de mieux piloter la politique publique. Vous pouvez y découvrir la répartition de l'offre sur un territoire, les territoires moins biens couverts en offre d'insertion ou encore les thématiques d'offre d'insertion. L'outil propose également des indicateurs clés sur l'offre d'insertion utiles à la rédaction de vos rapports d'analyse.
        <br><br>
        À noter que cet outil n'est pas un catalogue d'offre d'insertion. Pour consulter dans le détail les offres d'insertion sur un territoire, vous êtes invités à utiliser l'<a href="https://dora.inclusion.beta.gouv.fr/" target="_blank">outil DORA</a>.
      </div>

      <div class="locfiltres_container">
        <h2>Filtres</h2>
      </div>

      <div id="pages_controler">
        <div class="page_btn" @click="(page='ensemble')" :class="page=='ensemble'?'active':''">Analyse du territoire</div>
        <div class="page_btn" @click="(page='zoom')" :class="page=='ensemble'?'':'active'">Données</div>
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
      "page":"ensemble"
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
        height: 40px;
        text-align: center;
        cursor: pointer;
        margin-bottom: 0px;
        .page_btn{
          width: auto;
          padding:0 25px;
          color:#000638;
          font-family:Marianne;
          font-size: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border:1px solid #E6E6EB;
          border-bottom:1px solid white;
          border-radius: 8px 8px 0 0;
          background:#F2F3F5;
          margin-right: 5px;
          transform: translateY(1px);
          &:hover{
            text-decoration: underline;
          }
          &.active{
            font-weight: 700;
            background:#fff;
            cursor: default;
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
        margin-bottom: 25px;
        border:1px solid #E6E6EB;
        padding:25px;
        display:block;
        border-radius: 8px;
        h2{
          font-size: 24px;
          font-style: normal;
          font-weight: 700;
          line-height: 32px;
          margin-bottom: 15px;
        }
        b{
          font-weight: 700;
        }
        a{
          color:black;
          text-decoration: underline;
        }
      }
      .locfiltres_container{
        border:1px solid #E6E6EB;
        padding:25px;
        border-radius: 8px;
        margin-bottom: 25px;
        h2{
          font-size: 24px;
          font-style: normal;
          font-weight: 700;
          line-height: 32px;
          margin-bottom: 15px;
        }
      }
      .datavue{
        border:1px solid #E6E6EB;
        padding:25px;
        border-radius: 8px;
        border-top-left-radius: 0px;
        h2{
          color: #000638;
          font-family:Marianne;
          font-size: 24px;
          font-style: normal;
          font-weight: 700;
          line-height: 32px;
          margin-bottom: 15px;
        }
        .filters_selector{
          margin-bottom: 25px;
          h4{
            color: #000638;
            font-family:Marianne;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px;
            margin-bottom: 10px;
          }
          .filters_box{
            display: inline-flex;
            padding: 8px 16px 8px 16px;
            justify-content: center;
            align-items: center;
            font-family: Marianne;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid black;
            width: fit-content;
            position: relative;
            &:hover{
              background: #f5f5f5;
            }
          }
        }
      }
    }
    
  }
  
</style>
