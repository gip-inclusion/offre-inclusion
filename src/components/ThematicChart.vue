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

      <div class="top_text"><span class="highlight">{{positiveCount}} communes sont mieux dotées</span> en services que la moyenne dans le département</div>
      <div class="flop_text"><span class="highlight">{{negativeCount}} communes sont moins bien</span> dotées en services que la moyenne dans le département</div>

      <div class="legende_text">Ecart par rapport à la moyenne du nombre de services par habitants</div>
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
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.parsed.y + '%';
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
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
      },
      positiveCount: 0,
      negativeCount: 0
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

      // Calculate average of normalized counts
      const average = sortedEntries.reduce((sum, [, count]) => sum + parseFloat(count), 0) / sortedEntries.length;
      console.log(average)

      // Calculate difference from average in percentage points
      var differencesFromAverage = sortedEntries.map(([commune, count]) => {
        const difference = ((parseFloat(count) - average) / average * 100).toFixed(1);
        return [commune, difference];
      });

      // Replace INSEE codes with commune names and format them
      var differencesWithNames = differencesFromAverage.map(([insee, difference]) => {
        const communeEntry = population.find(entry => entry.insee === insee);
        const communeName = communeEntry ? communeEntry.nom_commune : insee;
        // Format name: capitalize first letter of each word and after hyphens
        let formattedName = communeName.toLowerCase().replace(/(^\w|\s\w|-\w)/g, letter => letter.toUpperCase());
        // Truncate to 15 characters and add ellipsis if needed
        formattedName = formattedName.length > 17 ? formattedName.slice(0, 15) + '...' : formattedName;
        return [formattedName, difference];
      });
      
      // Update differencesFromAverage with the named version
      differencesFromAverage = differencesWithNames;

      // Count number of communes with positive difference
      const positiveCount = differencesFromAverage.filter(([, diff]) => parseFloat(diff) > 0).length;
      this.positiveCount = positiveCount;
      const negativeCount = differencesFromAverage.filter(([, diff]) => parseFloat(diff) < 0).length;
      this.negativeCount = negativeCount;

      // Convert to arrays for chart.js
      const communes = differencesFromAverage.map(([commune]) => commune);
      const counts = differencesFromAverage.map(([, count]) => count);

      this.chartConfig = {
        type: 'bar',
        data: {
          labels: communes,
          datasets: [{
            data: counts,
            backgroundColor: counts.map(value => 
              parseFloat(value) >= 0 ? 'rgba(0, 120, 243, 1)' : 'rgba(214, 77, 0, 1)'
            ),
            borderColor: counts.map(value => 
              parseFloat(value) >= 0 ? 'rgba(0, 120, 243, 1)' : 'rgba(214, 77, 0, 1)'
            ),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return context.parsed.y + '% de services par habitant';
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false
              },
              title: {
                display: true,
                text: '% de différence par rapport à la moyenne'
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