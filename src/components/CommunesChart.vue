<template>
  <div class="thematic-chart">
    
    <div class="edito-container">
        
      <div class="filters_selector">
          <h4>Thématique</h4>
          <div class="filters_box" ref="dropdown" @click="toggleDropdown">
              <div>
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

      <div class="average_text">En moyenne, {{ selectedBassin ? "dans ce bassin chaque commune est couverte" : "les communes de chaque bassin sont couvertes" }} par <span class="highlight">{{average > 1 ? average.toFixed(0).toLocaleString() : average.toFixed(1).toLocaleString() }}&nbsp;services</span> pour 10 000 habitants <span v-if="selectedThematique">pour cette thématique</span></div>
      <div class="top_text"><span class="highlight">{{positiveCount}} {{ selectedBassin ? "communes sont mieux dotées" : "bassins sont mieux dotés" }}</span> en services que la moyenne {{ selectedBassin ? "dans ce bassin" : "dans le département" }}</div>
      <div class="flop_text"><span class="highlight">{{negativeCount}} {{ selectedBassin ? "communes sont moins bien dotées" : "bassins sont moins bien dotés" }}</span> en services que la moyenne {{ selectedBassin ? "dans ce bassin" : "dans le département" }}</div>
      <div class="zero_text" v-if="zeroCount > 0"><span class="highlight">{{zeroCount}} {{ selectedBassin ? "communes n'ont aucun" : "bassins n'ont aucun" }}</span> service couvrant cette thématique</div>

      <div class="legende_text">Services par 10 000 habitants
        <span class="legende_btn">(en savoir plus sur l'indicateur)</span>
        <div class="legende_tooltip">L'indicateur mesure pour chaque commune le nombre de services par habitants dans le département.</div>
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
import bassins from '../../public/data/bassins.json'
import { mapState } from 'vuex'
import annotationPlugin from 'chartjs-plugin-annotation'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
)

export default {
  name: 'CommunesChart',
  components: {
    Bar
  },
  data() {
    return {
      chartData: [],
      selectedThematique: null,
      isDropdownOpen: false,
      average: 0,
      thematiques: ["famille","numerique","remobilisation","accompagnement-social-et-professionnel-personnalise","sante","acces-aux-droits-et-citoyennete","handicap","se-former","mobilite","preparer-sa-candidature","logement-hebergement","creation-activite","trouver-un-emploi","gestion-financiere","choisir-un-metier","equipement-et-alimentation","illettrisme","souvrir-a-linternational","apprendre-francais"],
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
            },
            annotation: {
              annotations: {
                averageLine: {
                  type: 'line',
                  yMin: 0,
                  yMax: 0,
                  borderColor: 'rgba(0, 0, 145, 1)',
                  borderWidth: 1,
                  borderDash: [5, 5],
                  label: {
                    enabled: true,
                    content: 'Moyenne',
                    position: 'end'
                  }
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
                autoSkip: true,
                maxRotation: 90,
                minRotation: 90,
                callback: function(value, index, ticks) {
                  return self.formatCommuneName(this.chart.data.labels[index]);
                }
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
      negativeCount: 0,
      zeroCount: 0,
    }
  },
  computed: {
    servicesData() {
      return store.state.servicesData
    },
    ...mapState(['selectedBassin','selectedDepartement'])
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
      const filtersSelector = this.$el.querySelector('.filters_selector');
      if (filtersSelector && !filtersSelector.contains(event.target)) {
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
    },
    formatCommuneName(communeName) {
      let formattedName
      if(this.selectedBassin){
        formattedName = communeName.toLowerCase().replace(/(^\w|\s\w|-\w)/g, letter => letter.toUpperCase());
        formattedName = formattedName.length > 17 && formattedName.includes('-') ? formattedName.slice(0, formattedName.lastIndexOf('-')) : formattedName;
      }else{
        formattedName = communeName;
      }
      return formattedName;
    },
    createChart() {
      var self = this;
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
          }else{
            communeCount[inseeCode] = 0;
          }
        }
      
        
      // Sort by normalized count in descending order
      const sortedEntries = Object.entries(communeCount)
      .sort(([, countA], [, countB]) => countB - countA);

      // Calculate difference from average in percentage points
      var differencesFromAverage = sortedEntries.map(([commune, count]) => {
        //const difference = ((parseFloat(count) - average) / average * 100).toFixed(1);
        return [commune, count];
      });
      var differencesWithNames
      if(this.selectedBassin){
        var communesList = bassins[this.selectedDepartement][this.selectedBassin];
        differencesFromAverage = differencesFromAverage.filter(([insee]) => communesList.includes(insee));
        // Calculate average of normalized counts
        const average = differencesFromAverage.reduce((sum, [, count]) => sum + parseFloat(count), 0) / differencesFromAverage.length;
        this.average = average;
        differencesWithNames = differencesFromAverage.map(([insee, difference]) => {
          const communeEntry = population.find(entry => entry.insee === insee);
          const communeName = communeEntry ? communeEntry.nom_commune : insee;
          return [communeName, difference];
        });
      }else{
        var bassinsToDisplay = Object.keys(bassins[this.selectedDepartement])
        const bassinsAverages = bassinsToDisplay.map(bassinName => {
          const communesInBassin = bassins[this.selectedDepartement][bassinName];
          const relevantDifferences = differencesFromAverage.filter(([insee]) => communesInBassin.includes(insee));
          const average = differencesFromAverage.reduce((sum, [, count]) => sum + parseFloat(count), 0) / differencesFromAverage.length;
        this.average = average;
          const bassinAverage = (relevantDifferences.reduce((sum, [, diff]) => sum + parseFloat(diff), 0) / relevantDifferences.length).toFixed(1);
          return [bassinName, bassinAverage];
        }).sort(([,avgA], [,avgB]) => avgB - avgA);
        differencesWithNames = bassinsAverages;
      }

      differencesFromAverage = differencesWithNames;

      // Count number of communes with positive difference
      const positiveCount = differencesFromAverage.filter(([, diff]) => parseFloat(diff) > this.average).length;
      this.positiveCount = positiveCount;
      const negativeCount = differencesFromAverage.filter(([, diff]) => parseFloat(diff) < this.average && parseFloat(diff) > 0).length;
      this.negativeCount = negativeCount;
      const zeroCount = differencesFromAverage.filter(([, diff]) => parseFloat(diff) <= 0).length;
      this.zeroCount = zeroCount;

      // Convert to arrays for chart.js
      const communes = differencesFromAverage.map(([commune]) => commune);
      const counts = differencesFromAverage.map(([, count]) => count);
      
      this.chartConfig = {
        type: 'bar',
        data: {
          labels: communes,
          datasets: [{
            data: counts,
            backgroundColor: counts.map(value => {
              const numValue = parseFloat(value);
              if (numValue <= 0) return 'rgba(214, 77, 0, 0.2)';
              return numValue >= this.average ? 'rgba(0, 120, 243, 1)' : 'rgba(214, 77, 0, 1)';
            }),
            borderColor: counts.map(value => {
              const numValue = parseFloat(value);
              if (numValue <= 0) return 'rgba(214, 77, 0, 0.2)';
              return numValue >= this.average ? 'rgba(0, 120, 243, 1)' : 'rgba(214, 77, 0, 1)';
            }),
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
                  return context.parsed.y + ' services pour 10 000 habitants';
                }
              }
            },
            annotation: {
              annotations: {
                averageLine: {
                  type: 'line',
                  yMin: this.average,
                  yMax: this.average,
                  borderColor: '#000000',
                  borderWidth: 1,
                  borderDash: [5, 5],
                  label: {
                    display: true,
                    content: 'moyenne',
                    position: 'end',
                    backgroundColor: 'white',
                    color: '#000000',
                    padding: 0,
                    xAdjust: 0,
                    yAdjust: -10,
                    font: {
                      size: 12,
                      weight: 'normal'
                    }
                  }
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
                autoSkip: true,
                maxRotation: 45,
                minRotation: 45,
                callback: function(value, index, ticks) {
                  return self.formatCommuneName(this.chart.data.labels[index]);
                }
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false
              },
              title: {
                display: true,
                text: 'services pour 10 000 habitants'
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
    },
    selectedBassin() {
      this.createChart();
    }
  },
  mounted() {
    this.createChart();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>

<style scoped lang="scss">

</style> 