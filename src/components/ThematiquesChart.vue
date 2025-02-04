<template>
    <div class="thematic-chart">
      
      <div class="chart-container">
        <Bar :data="chartConfig.data" :options="chartConfig.options" />
      </div>

      <div class="edito-container">
          
          <div class="filters_selector">
              <h4>Sélectionnez une commune</h4>
              <div class="filters_box" ref="dropdown">
                  <div @click="toggleDropdown">
                  {{ selectedCommune ? selectedCommune.nom_commune : 'Toutes les communes' }}
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
    
          <div class="top_text"><span class="highlight">{{positiveCount}} thématiques sont mieux dotées</span> en services que la moyenne dans le département</div>
          <div class="flop_text" v-if="negativeCount > 0"><span class="highlight">{{negativeCount}} thématiques sont moins bien dotées</span> en services que la moyenne dans le département</div>
          <div class="zero_text" v-if="zeroCount > 0"><span class="highlight">{{zeroCount}} thématiques n'ont aucun </span>service couvrant cette commune</div>
          <div class="legende_text">Ecart par rapport à la moyenne du nombre de service par habitants dans le département</div>
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
        selectedCommune: null,
        isDropdownOpen: false,
        population,
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
        negativeCount: 0,
        zeroCount: 0
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
      selectCommune(commune) {
        this.selectedCommune = commune;
        this.isDropdownOpen = false;
        this.createChart();
      },
      handleClickOutside(event) {
        if (!this.$refs.dropdown.contains(event.target)) {
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
      formatCommuneName(name) {
        return name.toLowerCase()
          .split(/(?=[- ])|(?<=[- ])/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
      },
      createChart() {
        if (!this.servicesData) return;
        const thematicCount = {};
        
        this.thematiques.forEach(thematique => {
          thematicCount[thematique] = 0;
          this.servicesData.forEach(service => {
            if (service.Thematiques && (!this.selectedCommune || service["Code Insee"] === this.selectedCommune.insee)) {
              const serviceThematiques = Array.isArray(service.Thematiques) ? service.Thematiques : [service.Thematiques];
              if (serviceThematiques.some(t => t.includes(thematique)) && service.Source != 'fredo') {
                thematicCount[thematique]++;
              }
            }
          });
        });
        
        // Sort by normalized count in descending order
        const sortedEntries = Object.entries(thematicCount)
          .sort(([, countA], [, countB]) => countB - countA);

        // Calculate average of normalized counts
        const average = sortedEntries.reduce((sum, [, count]) => sum + parseFloat(count), 0) / sortedEntries.length;

        // Calculate difference from average in percentage points
        var differencesFromAverage = sortedEntries.map(([thematique, count]) => {
          const difference = ((parseFloat(count) - average) / average * 100).toFixed(1);
          return [thematique, difference];
        });

        // Format thematic names
        differencesFromAverage = differencesFromAverage.map(([thematique, difference]) => {
          return [this.formatThemeName(thematique), difference];
        });

        // Truncate thematique names to 17 characters
        differencesFromAverage = differencesFromAverage.map(([thematique, difference]) => {
          let truncatedName = thematique;
          truncatedName = truncatedName.length > 17 ? truncatedName.slice(0, 15) + '...' : truncatedName;
          return [truncatedName, difference];
        });

        // Count number of thematiques with positive/negative differences
        this.positiveCount = differencesFromAverage.filter(([, diff]) => parseFloat(diff) > 0).length;
        this.negativeCount = differencesFromAverage.filter(([, diff]) => parseFloat(diff) < 0 && parseFloat(diff) > -100).length;
        this.zeroCount =  differencesFromAverage.filter(([, diff]) => parseFloat(diff) <= -100).length;

        // Convert to arrays for chart.js
        const thematiques = differencesFromAverage.map(([thematique]) => thematique);
        const counts = differencesFromAverage.map(([, count]) => count);


        this.chartConfig = {
          type: 'bar',
          data: {
            labels: thematiques,
            datasets: [{
              data: counts,
              backgroundColor: counts.map(value => {
              const numValue = parseFloat(value);
              if (numValue <= -100) return 'rgba(214, 77, 0, 0.2)';
              return numValue >= 0 ? 'rgba(0, 120, 243, 1)' : 'rgba(214, 77, 0, 1)';
            }),
            borderColor: counts.map(value => {
              const numValue = parseFloat(value);
              if (numValue <= -100) return 'rgba(204, 164, 141, 0.2)';
              return numValue >= 0 ? 'rgba(0, 120, 243, 1)' : 'rgba(214, 77, 0, 1)';
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
      }
    },
    mounted() {
      this.createChart()
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style> 