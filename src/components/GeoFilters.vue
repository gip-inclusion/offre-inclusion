<template>
    <div class="filters_selector">
        
        <div class="filters_selector_item">
            <h4>Région</h4>
            <div class="filters_box" ref="regionDropdown" @click="toggleRegionDropdown">
                <div>
                {{ selectedRegion ? selectedRegion.nom : 'Toutes les régions' }}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.99999 9.99997L5.17133 7.1713L6.11466 6.22864L7.99999 8.11464L9.88533 6.22864L10.8287 7.1713L7.99999 9.99997Z" fill="black"/>
                </svg>
                </div>
                <div class="dropdown-content" v-if="isRegionDropdownOpen">
                <div 
                    v-for="region in regions" 
                    :key="region.nom"
                    class="dropdown-item"
                    @click="selectRegion(region)"
                >
                    {{ region.nom }}
                </div>
                </div>
            </div>
        </div>

        <div class="filters_selector_item">
            <h4>Département</h4>
            <div class="filters_box" ref="dropdown"  @click="toggleDropdown">
                <div>
                {{ selectedDepartement ? selectedDepartement.Nom : 'Toutes les départements' }}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.99999 9.99997L5.17133 7.1713L6.11466 6.22864L7.99999 8.11464L9.88533 6.22864L10.8287 7.1713L7.99999 9.99997Z" fill="black"/>
                </svg>
                </div>
                <div class="dropdown-content" v-if="isDropdownOpen">
                <div 
                    v-for="departement in departements.filter(d => selectedRegion ? selectedRegion.départements.includes(d.Code) : true)" 
                    :key="departement.Code"
                    class="dropdown-item"
                    @click="selectDepartement(departement)"
                >
                    {{ departement.Nom }}
                </div>
                </div>
            </div>
        </div>

        <div class="filters_selector_item" v-if="page == 'ensemble'&&selectedDepartement">
            <h4>Bassin d'emploi</h4>
            <div class="filters_box" ref="bassinDropdown" id="bassinDropdown" @click="toggleBassinDropdown">
                <div>
                {{ selectedBassin ? selectedBassin : 'Tous les bassins' }}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.99999 9.99997L5.17133 7.1713L6.11466 6.22864L7.99999 8.11464L9.88533 6.22864L10.8287 7.1713L7.99999 9.99997Z" fill="black"/>
                </svg>
                </div>
                <div class="dropdown-content" v-if="isBassinDropdownOpen">
                <div 
                    class="dropdown-item"
                    @click="selectBassin(null)"
                >
                    Tous les bassins
                </div>
                <div 
                    class="dropdown-separator"
                ></div>
                <div 
                    v-for="bassin,i in bassins" 
                    :key="i"
                    class="dropdown-item"
                    @click="selectBassin(i)"
                >
                    {{ i }}
                </div>
                </div>
            </div>
        </div>

        <div class="filters_selector_item" v-if="page == 'zoom'&&selectedDepartement">
            <h4>Commune</h4>
            <div class="filters_box" ref="communeDropdown" id="communeDropdown">
                <div @click="toggleCommuneDropdown">
                {{ selectedCommune ? formatCommuneName(population.find(c => c.insee === selectedCommune).nom_commune) : 'Toutes les communes' }}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.99999 9.99997L5.17133 7.1713L6.11466 6.22864L7.99999 8.11464L9.88533 6.22864L10.8287 7.1713L7.99999 9.99997Z" fill="black"/>
                </svg>
                </div>
                <div class="dropdown-content" v-if="isCommuneDropdownOpen">
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


      
    </div>
    
  </template>
  
  <script>
  //import { mapState } from 'vuex'
  import francePopulation from '../../public/data/population.json'
  import bassins from '../../public/data/bassins.json'

  export default {
    name: 'GeoFilters',
    components: {
    
    },
    data(){
      return {
        selectedDepartement: { "Code": "01", "Nom": "Ain" },
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
            "Code": "69",
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
        regions:[
            {"nom": "Auvergne-Rhône-Alpes", "départements": ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"]},
            {"nom": "Bourgogne-Franche-Comté", "départements": ["21", "25", "39", "58", "70", "71", "89", "90"]},
            {"nom": "Bretagne", "départements": ["22", "29", "35", "56"]},
            {"nom": "Centre-Val de Loire", "départements": ["18", "28", "36", "37", "41", "45"]},
            {"nom": "Corse", "départements": ["2A", "2B"]},
            {"nom": "Grand Est", "départements": ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"]},
            {"nom": "Hauts-de-France", "départements": ["02", "59", "60", "62", "80"]},
            {"nom": "Île-de-France", "départements": ["75", "77", "78", "91", "92", "93", "94", "95"]},
            {"nom": "Normandie", "départements": ["14", "27", "50", "61", "76"]},
            {"nom": "Nouvelle-Aquitaine", "départements": ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"]},
            {"nom": "Occitanie", "départements": ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"]},
            {"nom": "Pays de la Loire", "départements": ["44", "49", "53", "72", "85"]},
            {"nom": "Provence-Alpes-Côte d'Azur", "départements": ["04", "05", "06", "13", "83", "84"]},
            {"nom": "Régions ultramarines", "départements": ["971", "972", "973", "974", "975", "976"]}
        ],
        selectedRegion: {"nom": "Auvergne-Rhône-Alpes", "départements": ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"]},
        isRegionDropdownOpen: false,
        selectedBassin: null,
        isBassinDropdownOpen: false,
        selectedCommune: null,
        isCommuneDropdownOpen: false
      }
    },
    computed: {

        population() {
            return francePopulation.filter(commune => commune.insee.startsWith(this.selectedDepartement.Code))
        },
        bassins() {
            return bassins[this.selectedDepartement.Code]
        },

        page() {
            return this.$parent.page;
        },
      
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
      selectDepartement(departement) {
        this.selectedDepartement = departement;
        this.$store.commit('SET_SELECTED_DEPARTEMENT', departement.Code);
        this.isDropdownOpen = false;
        this.resetFilters();
      },
      toggleRegionDropdown() {
        this.isRegionDropdownOpen = !this.isRegionDropdownOpen;
      },
      selectRegion(region) {
        this.selectedRegion = region;
        this.selectedDepartement = this.departements.find(d => this.selectedRegion["départements"].includes(d.Code));
        this.selectDepartement(this.selectedDepartement);
        this.isRegionDropdownOpen = false;
        this.resetFilters();
      },
      toggleCommuneDropdown() {
        this.isCommuneDropdownOpen = !this.isCommuneDropdownOpen;
      },
      selectCommune(commune) {
        this.resetFilters();
        if(commune){
            this.selectedCommune = commune.insee;
            this.$store.commit('SET_SELECTED_COMMUNE', commune.insee);
        }else{
            this.selectedCommune = null;
            this.$store.commit('SET_SELECTED_COMMUNE', null);
        }
        this.isCommuneDropdownOpen = false;
      },
      toggleBassinDropdown() {
        this.isBassinDropdownOpen = !this.isBassinDropdownOpen;
      },
      selectBassin(bassin) {
        this.resetFilters();
        this.selectedBassin = bassin;
        this.$store.commit('SET_SELECTED_BASSIN', bassin);
        this.isBassinDropdownOpen = false;
      },
      resetFilters() {
        this.selectedBassin = null;
        this.selectedCommune = null;
        this.$store.commit('SET_SELECTED_BASSIN', null);
        this.$store.commit('SET_SELECTED_COMMUNE', null);
      },

      formatCommuneName(name) {
        return name.toLowerCase()
          .split(/(?=[- ])|(?<=[- ])/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
      },
      handleClickOutside(event) {
        if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
          this.isDropdownOpen = false;
        }
        if (this.$refs.regionDropdown && !this.$refs.regionDropdown.contains(event.target)) {
          this.isRegionDropdownOpen = false;
        }
        if (this.$refs.bassinDropdown && !this.$refs.bassinDropdown.contains(event.target)) {
          this.isBassinDropdownOpen = false;
        }
        if (this.$refs.communeDropdown && !this.$refs.communeDropdown.contains(event.target)) {
          this.isCommuneDropdownOpen = false;
        }
      }
    }
  }
  </script>
  <style lang="scss">
  @import "../../css/overload-fonts.css";
  
  @media (max-width: 728px) {
    
  }
  </style>
  