<template>
  <div id="vueTerritoire">
    
    <div class="vueTerritoire_container">
      <h2>Comment l'offre d'insertion est-elle répartie sur le territoire ?</h2>  
      
      <div id="maps_wrapper">

        <div class="map_container">
          <div class="map_title">Location des services sur le territoire</div>
          <SymbolMap />
        <div class="map_legend">Géolocalisation des services</div>
        </div>

        <div class="map_container">
          <div class="map_title">Répartition de l'offre par densité de population</div>
          <ColorMap />
          <div class="map_legend">Services pour 100 demandeurs d'emploi par commune</div>
        </div>

      </div>

    </div>

    <div class="vueTerritoire_container">
      <h2 v-if="!selectedBassin">Comment les bassins d'emploi sont-ils couverts dans ce département ?</h2>
      <h2 v-else>Comment les communes sont-elles couvertes dans ce bassin ?</h2>

      <div class="chart_container">

        <CommunesChart />

      </div>

    </div>

    <div class="vueTerritoire_container">

        <h2 v-if="!selectedBassin">Comment les thématiques sont-elles couvertes dans ce département ?</h2>
        <h2 v-else>Comment les thématiques sont-elles couvertes dans ce bassin ?</h2>
      

      <div class="chart_container">

        <ThematiquesChart />

      </div>

    </div>
    
  </div>
  
</template>

<script>
import SymbolMap from './SymbolMap.vue'
import ColorMap from './ColorMap.vue'
import CommunesChart from './CommunesChart.vue'
import ThematiquesChart from './ThematiquesChart.vue'
import { mapState } from 'vuex'

export default {
  name: 'VueTerritoire',
  components: {
    SymbolMap,
    ColorMap,
    CommunesChart,
    ThematiquesChart
  },
  data(){
    return {
      thematiques: ["famille","numerique","remobilisation","accompagnement-social-et-professionnel-personnalise","sante","acces-aux-droits-et-citoyennete","handicap","se-former","mobilite","preparer-sa-candidature","logement-hebergement","creation-activite","trouver-un-emploi","gestion-financiere","choisir-un-metier","equipement-et-alimentation","illettrisme","souvrir-a-linternational","apprendre-francais"],
      isDropdownOpen: false,
      departements:[
        {
            "Code": "01",
            "Nom": "Ain"
        },
        {
            "Code": "02",
            "Nom": "Aisne"
        },
        {
            "Code": "03",
            "Nom": "Allier"
        },
        {
            "Code": "04",
            "Nom": "Alpes-de-Haute-Provence"
        },
        {
            "Code": "05",
            "Nom": "Hautes-Alpes"
        },
        {
            "Code": "06",
            "Nom": "Alpes-Maritimes"
        },
        {
            "Code": "07",
            "Nom": "Ardèche"
        },
        {
            "Code": "08",
            "Nom": "Ardennes"
        },
        {
            "Code": "09",
            "Nom": "Ariège"
        },
        {
            "Code": "10",
            "Nom": "Aube"
        },
        {
            "Code": "11",
            "Nom": "Aude"
        },
        {
            "Code": "12",
            "Nom": "Aveyron"
        },
        {
            "Code": "13",
            "Nom": "Bouches-du-Rhône"
        },
        {
            "Code": "14",
            "Nom": "Calvados"
        },
        {
            "Code": "15",
            "Nom": "Cantal"
        },
        {
            "Code": "16",
            "Nom": "Charente"
        },
        {
            "Code": "17",
            "Nom": "Charente-Maritime"
        },
        {
            "Code": "18",
            "Nom": "Cher"
        },
        {
            "Code": "19",
            "Nom": "Corrèze"
        },
        {
            "Code": "2A",
            "Nom": "Corse-du-Sud"
        },
        {
            "Code": "2B",
            "Nom": "Haute-Corse"
        },
        {
            "Code": "21",
            "Nom": "Côte-d'Or"
        },
        {
            "Code": "22",
            "Nom": "Côtes-d'Armor"
        },
        {
            "Code": "23",
            "Nom": "Creuse"
        },
        {
            "Code": "24",
            "Nom": "Dordogne"
        },
        {
            "Code": "25",
            "Nom": "Doubs"
        },
        {
            "Code": "26",
            "Nom": "Drôme"
        },
        {
            "Code": "27",
            "Nom": "Eure"
        },
        {
            "Code": "28",
            "Nom": "Eure-et-Loir"
        },
        {
            "Code": "29",
            "Nom": "Finistère"
        },
        {
            "Code": "30",
            "Nom": "Gard"
        },
        {
            "Code": "31",
            "Nom": "Haute-Garonne"
        },
        {
            "Code": "32",
            "Nom": "Gers"
        },
        {
            "Code": "33",
            "Nom": "Gironde"
        },
        {
            "Code": "34",
            "Nom": "Hérault"
        },
        {
            "Code": "35",
            "Nom": "Ille-et-Vilaine"
        },
        {
            "Code": "36",
            "Nom": "Indre"
        },
        {
            "Code": "37",
            "Nom": "Indre-et-Loire"
        },
        {
            "Code": "38",
            "Nom": "Isère"
        },
        {
            "Code": "39",
            "Nom": "Jura"
        },
        {
            "Code": "40",
            "Nom": "Landes"
        },
        {
            "Code": "41",
            "Nom": "Loir-et-Cher"
        },
        {
            "Code": "42",
            "Nom": "Loire"
        },
        {
            "Code": "43",
            "Nom": "Haute-Loire"
        },
        {
            "Code": "44",
            "Nom": "Loire-Atlantique"
        },
        {
            "Code": "45",
            "Nom": "Loiret"
        },
        {
            "Code": "46",
            "Nom": "Lot"
        },
        {
            "Code": "47",
            "Nom": "Lot-et-Garonne"
        },
        {
            "Code": "48",
            "Nom": "Lozère"
        },
        {
            "Code": "49",
            "Nom": "Maine-et-Loire"
        },
        {
            "Code": "50",
            "Nom": "Manche"
        },
        {
            "Code": "51",
            "Nom": "Marne"
        },
        {
            "Code": "52",
            "Nom": "Haute-Marne"
        },
        {
            "Code": "53",
            "Nom": "Mayenne"
        },
        {
            "Code": "54",
            "Nom": "Meurthe-et-Moselle"
        },
        {
            "Code": "55",
            "Nom": "Meuse"
        },
        {
            "Code": "56",
            "Nom": "Morbihan"
        },
        {
            "Code": "57",
            "Nom": "Moselle"
        },
        {
            "Code": "58",
            "Nom": "Nièvre"
        },
        {
            "Code": "59",
            "Nom": "Nord"
        },
        {
            "Code": "60",
            "Nom": "Oise"
        },
        {
            "Code": "61",
            "Nom": "Orne"
        },
        {
            "Code": "62",
            "Nom": "Pas-de-Calais"
        },
        {
            "Code": "63",
            "Nom": "Puy-de-Dôme"
        },
        {
            "Code": "64",
            "Nom": "Pyrénées-Atlantiques"
        },
        {
            "Code": "65",
            "Nom": "Hautes-Pyrénées"
        },
        {
            "Code": "66",
            "Nom": "Pyrénées-Orientales"
        },
        {
            "Code": "67",
            "Nom": "Bas-Rhin"
        },
        {
            "Code": "68",
            "Nom": "Haut-Rhin"
        },
        {
            "Code": "69D",
            "Nom": "Rhône"
        },
        {
            "Code": "69M",
            "Nom": "Métropole de Lyon"
        },
        {
            "Code": "70",
            "Nom": "Haute-Saône"
        },
        {
            "Code": "71",
            "Nom": "Saône-et-Loire"
        },
        {
            "Code": "72",
            "Nom": "Sarthe"
        },
        {
            "Code": "73",
            "Nom": "Savoie"
        },
        {
            "Code": "74",
            "Nom": "Haute-Savoie"
        },
        {
            "Code": "75",
            "Nom": "Paris"
        },
        {
            "Code": "76",
            "Nom": "Seine-Maritime"
        },
        {
            "Code": "77",
            "Nom": "Seine-et-Marne"
        },
        {
            "Code": "78",
            "Nom": "Yvelines"
        },
        {
            "Code": "79",
            "Nom": "Deux-Sèvres"
        },
        {
            "Code": "80",
            "Nom": "Somme"
        },
        {
            "Code": "81",
            "Nom": "Tarn"
        },
        {
            "Code": "82",
            "Nom": "Tarn-et-Garonne"
        },
        {
            "Code": "83",
            "Nom": "Var"
        },
        {
            "Code": "84",
            "Nom": "Vaucluse"
        },
        {
            "Code": "85",
            "Nom": "Vendée"
        },
        {
            "Code": "86",
            "Nom": "Vienne"
        },
        {
            "Code": "87",
            "Nom": "Haute-Vienne"
        },
        {
            "Code": "88",
            "Nom": "Vosges"
        },
        {
            "Code": "89",
            "Nom": "Yonne"
        },
        {
            "Code": "90",
            "Nom": "Territoire de Belfort"
        },
        {
            "Code": "91",
            "Nom": "Essonne"
        },
        {
            "Code": "92",
            "Nom": "Hauts-de-Seine"
        },
        {
            "Code": "93",
            "Nom": "Seine-Saint-Denis"
        },
        {
            "Code": "94",
            "Nom": "Val-de-Marne"
        },
        {
            "Code": "95",
            "Nom": "Val-d'Oise"
        },
        {
            "Code": "971",
            "Nom": "Guadeloupe"
        },
        {
            "Code": "972",
            "Nom": "Martinique"
        },
        {
            "Code": "973",
            "Nom": "Guyane"
        },
        {
            "Code": "974",
            "Nom": "La Réunion"
        },
        {
            "Code": "975",
            "Nom": "Saint-Pierre-et-Miquelon"
        },
        {
            "Code": "976",
            "Nom": "Mayotte"
        },
        {
            "Code": "977",
            "Nom": "Saint-Barthélemy"
        },
        {
            "Code": "978",
            "Nom": "Saint-Martin"
        },
        {
            "Code": "984",
            "Nom": "Terres australes et antarctiques françaises"
        },
        {
            "Code": "986",
            "Nom": "Wallis-et-Futuna"
        },
        {
            "Code": "987",
            "Nom": "Polynésie française"
        },
        {
            "Code": "988",
            "Nom": "Nouvelle-Calédonie"
        },
        {
            "Code": "989",
            "Nom": "Île de Clipperton"
        }
      ],
    }
  },
  computed: {
    ...mapState(['selectedThematique','selectedBassin', 'selectedDepartement']),
  },
  created(){
    
  },
  methods: {
  }
}
</script>

<style lang="scss">
@import "../../css/overload-fonts.css";

.vueTerritoire_container{
  border: 1px solid #E6E6EB;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}
#maps_wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0px;
  padding-bottom: 65px;
  .map_container {
  width: 460px;
  height: 460px;
  display: inline-block;
  .map_title {
    font-family: Marianne;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    color:#000638;
    margin-bottom: 10px;
  }
  .map {
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
  }
  .map_legend {
    font-family: Marianne;
    font-size: 16px;
    font-style: italic;
    font-weight: 400;
    line-height: 24px;
  }
}
}

.filters_box {
  .dropdown-content {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    min-width: 100%;
    width: max-content;
    white-space: nowrap;
    
    .dropdown-separator {
      height: 1px;
      background-color: #ccc;
      margin: 4px 0;
    }
    
    .dropdown-item {
      padding: 8px 12px;
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
.thematic-chart {
  width: 100%;
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  .edito-container{
    width: 35%;
    height: 400px;
    position: relative;
    .filter_rappel{
      font-family: Marianne;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      margin-bottom: 10px;
      background-color: #F5F5F5;
      padding: 4px 8px;
      border-radius: 8px;
      display: inline-block;
      margin-right: 10px;
    }
    .average_text{
      font-family: Marianne;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin-bottom: 10px;
      margin-top: 10px;
      .highlight{
        //text-decoration: underline;
        //text-decoration-style: dashed; 
        border-bottom: 1px dashed #000638;
      }
    }
    .top_text{
      font-family: Marianne;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin-bottom: 10px;
      .highlight{
        color: rgba(0, 120, 243, 1);
        font-weight: 700;
      }
    }
    .flop_text{
      font-family: Marianne;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin-bottom: 10px;
      .highlight{
        color: rgba(214, 77, 0, 1);
        font-weight: 700;
      }
    }
    .zero_text{
      font-family: Marianne;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin-bottom: 10px;
      opacity: 1;
      .highlight{
        color: #FF9B51;
        font-weight: 700;
      }
    }
    .legende_text{
      font-family: Marianne;
      font-size: 16px;
      font-style: italic;
      font-weight: 400;
      line-height: 24px;
      color: #000638;
      position: absolute;
      bottom: 0;
      &:hover{
        .legende_tooltip{
          display: block;
        }
      }
      .legende_btn{
        color: #000638;
        text-decoration: underline;
        cursor: pointer;
      }
      .legende_tooltip{
        display: none;
        position: absolute;
        top:-20px;
        left: 50% ;
        transform:translate(-50%,-100%);
        background-color:white;
        padding: 20px;
        width: 80%;
        border-radius: 4px;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);      
      }
    }
  }
  .chart-container {
    width: 65%;
    height: 400px;

  }
}
@media (max-width: 728px) {
  span {
    color: blue;
  }    
}
</style>
