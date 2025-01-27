<template>
  <div class="thematic-chart">
    
    <div class="edito-container">
        
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
        </div>

    <div class="chart-container">
      <Bar :data="chartConfig.data" :options="chartConfig.options" />
    </div>

  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'vue-chartjs'
import store from '@/store'
import population from '../../public/data/population.json'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'ThematicChart',
  components: {
    Bar
  },
  data() {
    return {
      chartData: [],
      selectedThematique: null,
      isDropdownOpen: false,
      thematiques: ['numerique', 'sante', 'acces', 'citoyennete', 'mobilite', 'creation', 'activite', 'financiere', 'metier', 'souvrir', 'linternational', 'francais'],
      chartConfig: {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: 'rgba(0, 0, 145, 1)',
            borderColor: 'rgba(0, 0, 145, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false
              },
              title: {
                display: true,
                text: 'Services pour 10 000 habitants'
              }
            }
          }
        }
      }
    }
  },
  computed: {
    servicesData() {
      return store.state.servicesData
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectThematique(theme) {
      this.selectedThematique = theme;
      this.isDropdownOpen = false;
    },
    handleClickOutside(event) {
      if (!this.$refs.dropdown.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    },
    formatThemeName(theme) {
      const accentsMap = {
        'numerique': 'numérique',
        'sante': 'santé',
        'acces': 'accès',
        'citoyennete': 'citoyenneté',
        'mobilite': 'mobilité',
        'creation': 'création',
        'activite': 'activité',
        'financiere': 'financière',
        'metier': 'métier',
        'souvrir': "s'ouvrir",
        'linternational': "l'international",
        'francais': 'français'
      };
      
      // Replace hyphens with spaces
      let formattedName = theme.replace(/-/g, ' ');
      
      // Apply accents replacements
      Object.entries(accentsMap).forEach(([key, value]) => {
        formattedName = formattedName.replace(new RegExp(key, 'g'), value);
      });
      
      // Capitalize first letter
      return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
    },
    createChart() {
      if (!this.servicesData) return;
      // Count services by commune
      const communeCount = {};
      
      // Create counts for each commune
      this.servicesData.forEach(service => {
        const thematiques = Array.isArray(service.Thematiques) ? service.Thematiques : [service.Thematiques];
        if (service["Code Insee"]) {
          if (!communeCount[service["Code Insee"]]) {
            communeCount[service["Code Insee"]] = 0;
          }
          // If a theme is selected, only count services for that theme
          if (service.Source != 'fredo' && !this.selectedThematique || thematiques.some(t => t.includes(this.selectedThematique))) {
            communeCount[service["Code Insee"]]++;
          }
        }
      });

      // Calculate services per 1000 inhabitants
      for (const inseeCode in communeCount) {
          const populationEntry = population.find(entry => entry.insee === inseeCode);
          if (populationEntry) {
            communeCount[inseeCode] = ((communeCount[inseeCode] / populationEntry.population) * 10000).toFixed(1); // Per 1000 inhabitants
          }
        }

    // Sort by normalized count in descending order
    const sortedEntries = Object.entries(communeCount)
    .sort(([, countA], [, countB]) => countB - countA);

      // Convert to arrays for chart.js
      const communes = sortedEntries.map(([commune]) => commune);
      const counts = sortedEntries.map(([, count]) => count);

      this.chartConfig = {
        type: 'bar',
        data: {
          labels: communes,
          datasets: [{
            data: counts
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false
              },
              title: {
                display: true,
                text: 'Services pour 10 000 habitants'
              }
            }
          }
        }
      }
    }
  },
  watch: {
    servicesData: {
      handler() {
        this.createChart();
      },
      immediate: true
    },
    selectedThematique() {
      this.createChart();
    }
  },
  mounted() {
    this.createChart()
  }
}
</script>

<style scoped lang="scss">

</style> 