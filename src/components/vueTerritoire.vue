<template>
  <div id="vueTerritoire">

    <span class="intro">
    Cet outil vous accompagne dans <b>l'analyse de l'offre d'insertion sur un territoire donné</b> afin de mieux piloter la politique publique. Vous pouvez y découvrir la répartition de l'offre sur un territoire, les territoires moins biens couverts en offre d'insertion ou encore les thématiques d'offre d'insertion. L'outil propose également des indicateurs clés sur l'offre d'insertion utiles à la rédaction de vos rapports d'analyse.
    <br><br>
    À noter que cet outil n'est pas un catalogue d'offre d'insertion. Pour consulter dans le détail les offres d'insertion sur un territoire, vous êtes invités à utiliser l'<a href="https://dora.inclusion.beta.gouv.fr/" target="_blank">outil DORA</a>.
    <br><br>
    Sources de données : les indicateurs proposés dans cet outil sont issus de la base de données de <a href="https://inclusion.gouv.fr/nos-services/datainclusion/" target="_blank"></a> data inclusion. Ainsi, les services qui ne sont pas référencés dans data inclusion (et donc DORA) ne sont pas valorisés sur cet outil. Dans ce contexte, des précautions d'usage et d'analyse sont à garder en tête.</span>

    <h2>L'offre d'insertion est-elle répartie de manière équilibrée ?</h2>
    
    <div class="filters_selector">
      <h4>Sélectionnez une thématique</h4>
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
        <div class="map_title">Les services sont principalement implantés dans les communes principales du département...</div>
        <SymbolMap />
      <div class="map_legend">Géolocalisation des services</div>
      </div>

      <div class="map_container">
        <div class="map_title">... mais par rapport à leur population, elles sont moins bien loties que leurs voisines</div>
        <ColorMap />
        <div class="map_legend">Nombre de services  pour 10 000 habitants par commune</div>
      </div>

    </div>

    <h2>Certaines communes sont-elles mieux ou moins bien dotées ?</h2>

    <div class="chart_container">

      <CommunesChart />

    </div>

    <h2>Certaines thématiques d'insertion sont-elles moins bien couvertes ?</h2>

    <div class="chart_container">

      <ThematiquesChart />

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

#maps_wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 150px;
  .map_container {
  width: 500px;
  height: 500px;
  display: inline-block;
  .map_title {
    font-family: Marianne;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
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
  position: relative;
  cursor: pointer;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  
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
  margin-bottom: 50px;
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
