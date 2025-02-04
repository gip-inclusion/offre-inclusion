<template>
  <div id="vueTerritoire">
    <h2>Chiffres clés</h2>
    <div v-if="structuresData" class="chiffre_box_container">
        <div class="chiffre_box">
            <span class="chiffre">{{structuresData.length.toLocaleString()}}</span>
            <span class="text">structures</span>
        </div>
        <div class="chiffre_box">
            <span class="chiffre">{{servicesData.length.toLocaleString()}}</span>
            <span class="text">services</span>
        </div>
        <div class="chiffre_box">
            <span class="chiffre">{{(servicesData.length/structuresData.length).toFixed(1).toLocaleString()}}</span>
            <span class="text">services<br>par structure</span>
        </div>
        <div class="chiffre_box">
            <span class="chiffre">98</span>
            <span class="text">services pour<br>10 000 habitants</span>
        </div>
    </div>
    <h2>Zoom sur les structures</h2>
    <div v-if="!structuresData" class="loading">Chargement des structures...</div>
    <template v-else>
      <table class="structures-table">
        <thead>
          <tr>
            <th>NOM</th>
            <th>COMMUNE</th>
            <!-- <th>ADRESSE</th> -->
            <th>SERVICES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(structure, index) in paginatedStructures" :key="index">
            <td>{{ structure.Nom }}</td>
            <td>{{ structure.Commune }}</td>
            <!-- <td>{{ structure.Adresse }}</td> -->
            <td>{{ countServicesForStructure(structure.ID) }}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination-controls">
        <button 
          :disabled="structuresCurrentPage === 1" 
          @click="structuresCurrentPage--"
        >
          <span>Précédent</span>
        </button>
        <span class="pagination-counter">Page {{ structuresCurrentPage }} sur {{ structuresTotalPages }}</span>
        <button 
          :disabled="structuresCurrentPage === structuresTotalPages" 
          @click="structuresCurrentPage++"
        >
          <span>Suivant</span>
        </button>
      </div>
    </template>


    <h2>Zoom sur les services</h2>
    
    <div v-if="!servicesData" class="loading">Chargement des services...</div>
    <template v-else>
      <table class="services-table">
        <thead>
          <tr>
            <th>NOM</th>
            <th>Structure</th>
            <th>THEMATIQUES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in paginatedServices" :key="index">
            <td>{{ service.Nom }}</td>
            <td>{{ getStructureName(service['Structure ID']) }}</td>
            <td>{{ formatThematiques(service.Thematiques) }}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination-controls">
        <button 
          :disabled="currentPage === 1" 
          @click="currentPage--"
        >
          <span>Précédent</span>
        </button>
        <span class="pagination-counter">Page {{ currentPage }} sur {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages" 
          @click="currentPage++"
        >
          <span>Suivant</span>
        </button>
      </div>
    </template>
  </div>
  
</template>

<script>
import store from '@/store'

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
    }
  },
  computed: {
    servicesData() {
      return store.state.servicesData
    },
    structuresData() {
      return store.state.structuresData
    },
    paginatedServices() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.servicesData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.servicesData.length / this.itemsPerPage);
    },
    paginatedStructures() {
      const start = (this.structuresCurrentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.structuresData.slice(start, end);
    },
    structuresTotalPages() {
      return Math.ceil(this.structuresData.length / this.itemsPerPage);
    }
  },
  created(){
    
  },
  methods: {
    formatThematiques(thematiquesString) {
      if (!thematiquesString) return '';
      const matchingThemes = this.thematiques
        .filter(theme => thematiquesString.includes(theme))
        .map(theme => this.formatThemeName(theme))
        .join(', ');
      return matchingThemes;
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
      return this.servicesData.filter(service => service['Structure ID'] === structureId).length;
    },
    getStructureName(structureId) {
      const structure = this.structuresData.find(s => s.ID === structureId);
      return structure ? structure.Nom : structureId;
    }
  }
}
</script>

<style lang="scss">
@import "../../css/overload-fonts.css";


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
    font-weight: 500;
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
    padding: 0.5rem 1rem;
    background-color: #1212ff;
    border:none;
    font-family: 'Marianne';
    font-weight: 500;
    cursor: pointer;
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
    font-weight: 500;
  }
  tr {
    font-weight: 400;
  }
}

</style>
