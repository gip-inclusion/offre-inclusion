<template>
  <div id="vueTerritoire">
    
    <div class="filters_selector">
        <h4>Appliquez des filtres</h4>
        <div class="filters_selector_item">
            <div class="filters_box" ref="communeDropdown" id="communeDropdown">
                <div @click="toggleDropdown">
                {{ selectedCommune ? formatCommuneName(population.find(c => c.insee === selectedCommune).nom_commune) : 'Toutes les communes' }}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.99999 9.99997L5.17133 7.1713L6.11466 6.22864L7.99999 8.11464L9.88533 6.22864L10.8287 7.1713L7.99999 9.99997Z" fill="black"/>
                </svg>
                </div>
                <div class="dropdown-content" v-if="isDropdownOpen">
                <div 
                    class="dropdown-item"
                    @click="selectCommune(null)"
                >
                    Toutes les communes
                </div>
                <div 
                    class="dropdown-separator"
                ></div>
                <div 
                    v-for="commune in population" 
                    :key="commune.insee"
                    class="dropdown-item"
                    @click="selectCommune(commune)"
                >
                    {{ formatCommuneName(commune.nom_commune) }}
                </div>
                </div>
            </div>
        </div>

        <div class="filters_selector_item">
            <div class="filters_box" ref="thematiqueDropdown" id="thematiqueDropdown">
                <div @click="toggleThematiqueDropdown">
                    {{ selectedThematique ? formatThemeName(selectedThematique) : 'Toutes les thématiques' }}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M7.99999 9.99997L5.17133 7.1713L6.11466 6.22864L7.99999 8.11464L9.88533 6.22864L10.8287 7.1713L7.99999 9.99997Z" fill="black"/>
                    </svg>
                </div>
                <div class="dropdown-content" v-if="isThematiqueDropdownOpen">
                    <div 
                        class="dropdown-item"
                        @click="selectThematique(null)"
                    >
                        Toutes les thématiques
                    </div>
                    <div class="dropdown-separator"></div>
                    <div 
                        v-for="thematique in thematiques" 
                        :key="thematique"
                        class="dropdown-item"
                        @click="selectThematique(thematique)"
                    >
                        {{ formatThemeName(thematique) }}
                    </div>
                    </div>
                </div>
            </div>
    </div>

    <div class="vueTableau_container">
      <h2>Indicateurs clés</h2>
      
      <div v-if="structuresData&&servicesData" class="chiffre_box_container">
          <div class="chiffre_box">
              <span class="chiffre">{{filteredStructures.length.toLocaleString()}}</span>
              <span class="text">structures</span>
          </div>
          <div class="chiffre_box">
              <span class="chiffre">{{filteredServices.length.toLocaleString()}}</span>
              <span class="text">services</span>
          </div>
          <div class="chiffre_box">
              <span class="chiffre">{{(filteredServices.length/filteredStructures.length).toFixed(1).toLocaleString()}}</span>
              <span class="text">services<br>par structure</span>
          </div>
          <div class="chiffre_box">
              <span class="chiffre">{{ populationRatio.toFixed(1).toLocaleString() }}</span>
              <span class="text">services pour<br>10 000 habitants</span>
          </div>
      </div>
    </div>

    <div class="vueTableau_container">
      <h2>Détail des structures</h2>
      <div v-if="!structuresData" class="loading">Chargement des structures...</div>
      <template v-else>
        <table class="structures-table">
          <thead>
            <tr>
              <th>Nom de la structure</th>
              <th>Commune</th>
              <!-- <th>ADRESSE</th> -->
              <th>Nombre de services</th>
              <th>Typologie</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(structure, index) in paginatedStructures" :key="index">
              <td>{{ structure.Nom }}</td>
              <td>{{ structure.Commune }}</td>
              <!-- <td>{{ structure.Adresse }}</td> -->
              <td>{{ countServicesForStructure(structure.ID) }}</td>
              <td>{{ structure.Typologie }}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="pagination-controls">
          <button 
            :disabled="structuresCurrentPage === 1" 
            @click="structuresCurrentPage--"
          >
            <span><svg viewBox='0 0 24 24' width='24' height='24' fill="#fff"><path d='m10.828 12 4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414-4.95 4.95Z'/></svg></span>
          </button>
          <span class="pagination-counter">{{ structuresCurrentPage }} sur {{ structuresTotalPages }}</span>
          <button 
            :disabled="structuresCurrentPage === structuresTotalPages" 
            @click="structuresCurrentPage++"
          >
            <span><svg viewBox='0 0 24 24' width='24' height='24' fill="#fff"><path d='m13.172 12-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414 4.95-4.95Z'/></svg></span>
          </button>
        </div>
      </template>
    </div>

    <div class="vueTableau_container">
      <h2>Détail des services</h2>
      
      <div v-if="!servicesData" class="loading">Chargement des services...</div>
      <template v-else>
      <table class="services-table">
        <thead>
          <tr>
            <th>Nom du service</th>
            <th>Nom de la structure</th>
            <th>Thématiques</th>
            <th>Profils visés</th>
            <th>Frais</th>
            <th>Accueil</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in paginatedServices" :key="index">
            <td>{{ service.Nom }}</td>
            <td>{{ getStructureName(service['Structure ID']) }}</td>
            <td>{{ formatThematiques(service.Thematiques) }}</td>
            <td>{{ formatProfils(service.Profils) }}</td>
            <td>{{ formatProfils(service.Frais) }}</td>
            <td>{{ formatProfils(service["Modes Accueil"]) }}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination-controls">
        <button 
          :disabled="currentPage === 1" 
          @click="currentPage--"
        >
        <span><svg viewBox='0 0 24 24' width='24' height='24' fill="#fff"><path d='m10.828 12 4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414-4.95 4.95Z'/></svg></span>
        </button>
        <span class="pagination-counter">{{ currentPage }} sur {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages" 
          @click="currentPage++"
        >
        <span><svg viewBox='0 0 24 24' width='24' height='24' fill="#fff"><path d='m13.172 12-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414 4.95-4.95Z'/></svg></span>
        </button>
      </div>
    </template>
    </div>
  </div>
  
</template>

<script>
import store from '@/store'
import population from '../../public/data/population.json'

export default {
  name: 'VueTableau',
  components: {

  },
  data(){
    return {
      currentPage: 1,
      structuresCurrentPage: 1,
      itemsPerPage: 5,
      thematiques: ["famille","numerique","remobilisation","accompagnement-social-et-professionnel-personnalise","sante","acces-aux-droits-et-citoyennete","handicap","se-former","mobilite","preparer-sa-candidature","logement-hebergement","creation-activite","trouver-un-emploi","gestion-financiere","choisir-un-metier","equipement-et-alimentation","illettrisme","souvrir-a-linternational","apprendre-francais"],
      selectedThematique: null,
      selectedCommune: null,
      isDropdownOpen: false,
      isThematiqueDropdownOpen: false,
      population,
    }
  },
  computed: {
    servicesData() {
      return store.state.servicesData
    },
    structuresData() {
      return store.state.structuresData
    },
    filteredServices() {
      var communesFiltredServices
      if (!this.selectedCommune) {
        communesFiltredServices = this.servicesData;
      }else{
        communesFiltredServices = this.servicesData.filter(service => service['Code Insee'] === this.selectedCommune);
      }
      if (this.selectedThematique) {
        communesFiltredServices = communesFiltredServices.filter(service => {
          const thematiques = Array.isArray(service.Thematiques) ? service.Thematiques : [service.Thematiques];
          return thematiques.some(t => t.includes(this.selectedThematique));
        });
      }
      return communesFiltredServices;
    },
    filteredStructures() {
      var communesFiltredStructures
      if (!this.selectedCommune) {
        communesFiltredStructures = this.structuresData;
      }else{
        communesFiltredStructures = this.structuresData.filter(structure => structure['Code Insee'] === this.selectedCommune);
      }
      if(this.selectedThematique){
        communesFiltredStructures = communesFiltredStructures.filter(structure => {
          return this.filteredServices.some(service => service['Structure ID'] === structure.ID);
        });
      }
      return communesFiltredStructures;
    },
    paginatedServices() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredServices.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredServices.length / this.itemsPerPage);
    },
    paginatedStructures() {
      const start = (this.structuresCurrentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredStructures.slice(start, end);
    },
    structuresTotalPages() {
      return Math.ceil(this.filteredStructures.length / this.itemsPerPage);
    },
    populationRatio(){
        var totalPopulation
        if (!this.selectedCommune) {
            totalPopulation = population.reduce((sum, commune) => sum + parseInt(commune.population), 0);
            return (this.filteredServices.length / totalPopulation) * 10000;
        }else{
            totalPopulation = population.find(commune => commune.insee === this.selectedCommune).population;
            return (this.filteredServices.length / totalPopulation) * 10000;
        }
    }
  },
  created(){
    
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectCommune(commune) {
      if(commune){
        this.selectedCommune = commune.insee;
      }else{
        this.selectedCommune = null;
      }
      this.isDropdownOpen = false;
    },
    handleClickOutside(event) {
      if (this.$refs.communeDropdown && !this.$refs.communeDropdown.contains(event.target)) {
        this.isDropdownOpen = false;
      }
      if (this.$refs.thematiqueDropdown && !this.$refs.thematiqueDropdown.contains(event.target)) {
        this.isThematiqueDropdownOpen = false;
      }
    },
    formatCommuneName(name) {
        return name.toLowerCase()
          .split(/(?=[- ])|(?<=[- ])/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
    },
    formatThematiques(thematiquesString) {
      if (!thematiquesString) return '';
      const matchingThemes = this.thematiques
        .filter(theme => thematiquesString.includes(theme))
        .map(theme => this.formatThemeName(theme))
        .join(', ');
      return matchingThemes;
    },

    formatProfils(profilsString) {
      if (!profilsString) return '';
      return profilsString
        .replace(/[{}]/g, '')
        .split(',')
        .map(word => word.trim()
          .replace(/salaries/g, 'salariés')
          .replace(/Salaries/g, 'Salariés')
          .replace(/en-/g, '')
          .replace(/a-/g, '')
          .charAt(0).toUpperCase() + 
          word.trim()
            .replace(/salaries/g, 'salariés')
            .replace(/Salaries/g, 'Salariés')
            .replace(/en-/g, '')
            .replace(/a-/g, '')
            .slice(1))
        .join(', ');
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
    },
    countServicesForStructure(structureId) {
      return this.filteredServices.filter(service => service['Structure ID'] === structureId).length;
    },
    getStructureName(structureId) {
      const structure = this.structuresData.find(s => s.ID === structureId);
      return structure ? structure.Nom : "";
    },
    toggleThematiqueDropdown() {
      this.isThematiqueDropdownOpen = !this.isThematiqueDropdownOpen;
    },
    selectThematique(thematique) {
      this.selectedThematique = thematique;
      this.isThematiqueDropdownOpen = false;
    },
  }
}
</script>

<style lang="scss">
@import "../../css/overload-fonts.css";


.datavue{
    margin-bottom: 100px;
}

.vueTableau_container{
  border: 1px solid #E6E6EB;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.chiffre_box_container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.chiffre_box {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
    .chiffre {
    font-family: 'Marianne';
    font-size: 20px;
    font-weight: 700;
    color:#220462;
  }
  .text {
    font-family: 'Marianne';
    font-size: 20px;
    font-weight: 700;
    color:#220462;
  }
}

.services-table {
  width: 100%;
  border-collapse: collapse;
  color:#000638;
  font-family: 'Marianne';
  td, th {
    padding: 1rem;
    text-align: left;
    width:25%; // Since there are 2 columns, each gets 50%
    border-bottom: 1px solid #E6E6EB;
    font-size:14px;
  }
  th{
    font-weight: 700;
    background-color: #F2F3F5;
    border-bottom: 1px solid transparent;
  }
  tr{
    font-weight: 400;
  }
}

.pagination-controls {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
    button {
    padding: 0px 15px;
    background-color: #000091;
    border:none;
    cursor: pointer;
    &:hover{
      background-color: #1212ff;
    }
    span{
        color:white;
    }
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
  .pagination-counter{
    font-size:14px;
    font-family: 'Marianne';
    font-weight: 500;
    
  }
}

.loading {
  text-align: center;
  padding: 2rem;
  font-style: italic;
  color: #666;
}

.structures-table {
  width: 100%;
  border-collapse: collapse;
  color: #000638;
  font-family: 'Marianne';
  margin-top: 2rem;
  td, th {
    padding: 1rem;
    text-align: left;
    width: 25%; 
    border-bottom: 1px solid #E6E6EB;
    font-size: 14px;
  }
  th {
    font-weight: 700;
    background-color: #F2F3F5;
    border-bottom: 1px solid transparent;
  }
  tr {
    font-weight: 400;
  }
}

.filters_selector_item{
    display: inline-block;
    margin-right: 1rem;
}

</style>
