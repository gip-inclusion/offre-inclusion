<template>
    <div class="thematic-chart">
    
      <div class="edito-container">
          
          <div v-if="!selectedBassin" class="filter_rappel">{{ departements.find(d => d.Code === selectedDepartement)?.Nom }}</div>
          <div v-if="selectedBassin" class="filter_rappel">{{selectedBassin}}</div>
          
          <div class="average_text">En moyenne, {{ selectedBassin ? "dans ce bassin" : "dans ce département" }} chaque thématique est couverte par <span class="highlight">{{average > 1 ? average.toFixed(0).toLocaleString() : average.toFixed(1).toLocaleString() }} services</span> <span v-if="selectedCommune">dans cette commune</span></div>
          <div class="top_text" v-if="positiveCount > 0"><span class="highlight">{{positiveText}}</span> de services que la moyenne</div>
          <div class="flop_text" v-if="negativeCount > 0"><span class="highlight">{{negativeText}}</span> de services que la moyenne</div>
          <div class="zero_text" v-if="zeroCount > 0"><span class="highlight">{{zeroText}}</span> {{ selectedBassin ? "dans ce bassin" : "dans ce département" }}</div>
          <div class="legende_text">Nombre de services par thématiques
            <span class="legende_btn">(en savoir plus sur l'indicateur)</span>
            <div class="legende_tooltip">L'indicateur mesure pour chaque thématique le nombre de services</div>
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
        average: 0,
        population,
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
      ...mapState(['selectedBassin','selectedDepartement']),
      positiveText(){
        if(this.positiveCount == 1){
          return this.positiveCount + " thématique a plus"
        }else{
          return this.positiveCount + " thématiques ont plus"
        }
      },
      negativeText(){
        if(this.negativeCount == 1){
          return this.negativeCount + " thématique a moins"
        }else{
          return this.negativeCount + " thématiques ont moins"
        }
      },
      zeroText(){
        if(this.zeroCount == 1){
          return this.zeroCount + " thématique n'a aucun service"
        }else{
          return this.zeroCount + " thématiques n'ont aucun service"
        }
      }
    },
    methods: {
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

      truncateThemeName(name) {
        let formattedName = name;
        formattedName = formattedName.length > 17 && formattedName.includes(' ') ? formattedName.slice(0, formattedName.indexOf(' ')) : formattedName;
        return formattedName;
      },

      createChart() {
        var self = this;
        if (!this.servicesData) return;
        const thematicCount = {};
        
        this.thematiques.forEach(thematique => {
          thematicCount[thematique] = 0;
          this.servicesData.forEach(service => {
            if (service.Thematiques && (!this.selectedBassin || bassins[this.selectedDepartement][this.selectedBassin].includes(service["Code Insee"]))) {
              const serviceThematiques = Array.isArray(service.Thematiques) ? service.Thematiques : [service.Thematiques];
              if (serviceThematiques.some(t => t.includes(thematique)) && service.Source != 'fredo') {
                thematicCount[thematique]++;
              }
            }
          });
        });
        
        // Sort by normalized count in descending order
        var sortedEntries = Object.entries(thematicCount)
          .sort(([, countA], [, countB]) => countB - countA);

        // Calculate average of normalized counts
        const average = sortedEntries.reduce((sum, [, count]) => sum + parseFloat(count), 0) / sortedEntries.length;
        this.average = average;
        
        // Format thematic names
        sortedEntries = sortedEntries.map(([thematique, difference]) => {
          return [this.formatThemeName(thematique), difference];
        });

        // Count number of thematiques with positive/negative differences
        this.positiveCount = sortedEntries.filter(([, diff]) => parseFloat(diff) > this.average).length;
        this.negativeCount = sortedEntries.filter(([, diff]) => parseFloat(diff) < this.average && parseFloat(diff) > 0).length;
        this.zeroCount =  sortedEntries.filter(([, diff]) => parseFloat(diff) <= 0).length;

        // Convert to arrays for chart.js
        const thematiques = sortedEntries.map(([thematique]) => thematique);
        const counts = sortedEntries.map(([, count]) => count);
        
        this.chartConfig = {
          type: 'bar',
          data: {
            labels: thematiques,
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
                    return context.parsed.y + ' services';
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
                    return self.truncateThemeName(self.formatThemeName(this.chart.data.labels[index]));
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
                  text: ' services par thématique'
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
      selectedBassin() {
        this.createChart();
      }
    },
    mounted() {
      this.createChart();
    },
    
  }
  </script>
  
  <style scoped lang="scss">
  
  </style> 