<template>
  <div id="app">
    <div id="wrapper">

      <h1>L’offre d’insertion est-elle bien répartie sur mon territoire ?</h1>

      <div class="intro">
        <h2>Informations sur ce tableau</h2>
        Cet outil vous accompagne dans l'analyse de l'offre d'insertion dans les territoires. Vous pouvez analyser la répartition de l'offre sur un territoire et identifier les zones ou thématiques moins dotées en offre. L'outil propose également des indicateurs clés utiles à la rédaction de vos rapports d'analyse.
        <br><br>
        À noter que cet outil n'est pas un catalogue d'offre d'insertion. Pour consulter dans le détail les offres d'insertion sur un territoire, vous êtes invités à utiliser <a href="https://dora.inclusion.beta.gouv.fr/" target="_blank">l'outil DORA</a>. Par ailleurs, l'outil s'appuie sur les données de <a href="https://data.inclusion.gouv.fr/" target="_blank">data·inclusion</a>. De ce fait, il valorise uniquement les offres d'insertion référencées sur le produit. L'outil doit ainsi être utilisé avec précaution puisque l'ensemble de l'offre d'insertion existante n'est pas référencée.
      </div>

      <div class="locfiltres_container">
        <h2>Filtres</h2>
        <GeoFilters />
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
import GeoFilters from './components/GeoFilters.vue'
import store from '@/store'
import { getData } from './import.js'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    VueTerritoire,
    VueTableau,
    GeoFilters
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
    ...mapState(['selectedDepartement'])
  },

  watch:{
    dataImport:function(){
      //console.log(store.state.myData)
    },
    selectedDepartement:function(){
      getData(store)
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
      }
      .filters_selector{
          .filters_selector_item{
            display: inline-block;
            margin-right: 1rem;
          }
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
            padding: 8px 35px 8px 16px;
            justify-content: left;
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
            min-width: 115px;
            &:hover{
              background: #f5f5f5;
            }
            svg{
              position: absolute;
              right: 10px;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
    }
    
  }
  
</style>
