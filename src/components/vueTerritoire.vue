<template>
  <div id="vueTerritoire">
    
    <div class="vueTerritoire_container">
      <h2>L'offre d'insertion est-elle répartie de manière équilibrée ?</h2>  
      <div class="filters_selector">
        <h4>Thématique</h4>
        <div class="filters_box" ref="dropdown">
          <div @click="toggleDropdown">
            {{ selectedThematique ? formatThemeName(selectedThematique) : 'Toutes les thématiques' }}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7.99999 9.99997L5.17133 7.1713L6.11466 6.22864L7.99999 8.11464L9.88533 6.22864L10.8287 7.1713L7.99999 9.99997Z" fill="black"/>
            </svg>
          </div>
          <div class="dropdown-content" v-if="isDropdownOpen">
            <div 
              class="dropdown-item"
              @click="selectThematique(null)"
            >
              Toutes les thématiques
            </div>
            <div 
              class="dropdown-separator"
            ></div>
            <div 
              v-for="theme in thematiques" 
              :key="theme"
              class="dropdown-item"
              @click="selectThematique(theme)"
            >
              {{ formatThemeName(theme) }}
            </div>
          </div>
        </div>
      </div>
      <div id="maps_wrapper">

        <div class="map_container">
          <div class="map_title">Location des services sur le territoire</div>
          <SymbolMap />
        <div class="map_legend">Géolocalisation des services</div>
        </div>

        <div class="map_container">
          <div class="map_title">Répartition de l'offre par densité de population</div>
          <ColorMap />
          <div class="map_legend">Nombre de services  pour 10 000 habitants par commune</div>
        </div>

      </div>

    </div>

    <div class="vueTerritoire_container">
      <h2>Certaines communes sont-elles mieux ou moins bien dotées ?</h2>

      <div class="chart_container">

        <CommunesChart />

      </div>

    </div>

    <div class="vueTerritoire_container">

      <h2>Certaines thématiques d'insertion sont-elles moins bien couvertes ?</h2>

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
    }
  },
  computed: {
    ...mapState(['selectedThematique']),
  },
  created(){
    
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  unmounted() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectThematique(theme) {
      this.$store.commit('SET_SELECTED_THEMATIQUE', theme);
      this.isDropdownOpen = false;
    },
    handleClickOutside(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    },
    formatThemeName(theme) {
      const accentsMap = {
        "famille": "Famille",
        "numerique": "Numérique",
        "remobilisation": "Remobilisation",
        "accompagnement-social-et-professionnel-personnalise": "Accompagnement social et professionnel personnalisé",
        "sante": "Santé",
        "acces-aux-droits-et-citoyennete": "Accès aux droits et citoyenneté",
        "handicap": "Handicap",
        "se-former": "Se former",
        "mobilite": "Mobilité",
        "preparer-sa-candidature": "Préparer sa candidature",
        "logement-hebergement": "Logement et hébergement",
        "creation-activite": "Création d'activité",
        "trouver-un-emploi": "Trouver un emploi",
        "gestion-financiere": "Gestion financière",
        "choisir-un-metier": "Choisir un métier",
        "equipement-et-alimentation": "Equipement et alimentation",
        "illettrisme": "Illetrisme",
        "souvrir-a-linternational": "S'ouvrir à l'international",
        "apprendre-francais": "Apprendre le français"
      };
      
      return accentsMap[theme] || theme;
    }
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
    width: 45%;
    height: 400px;
    position: relative;
    .average_text{
      font-family: Marianne;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin-bottom: 10px;
      .highlight{
        font-weight: 700;
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
    width: 55%;
    height: 400px;

  }
}
@media (max-width: 728px) {
  span {
    color: blue;
  }    
}
</style>
