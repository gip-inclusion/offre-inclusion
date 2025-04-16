<template>
  <div class="thematic-chart">
    
    <div class="edito-container">

      <div v-if="!selectedBassin" class="filter_rappel">{{ departements.find(d => d.Code === selectedDepartement)?.Nom }}</div>
      <div v-if="selectedBassin" class="filter_rappel">{{selectedBassin}}</div>
      <div v-if="!selectedThematique" class="filter_rappel">Toutes les thématiques</div>
      <div v-if="selectedThematique" class="filter_rappel">{{formatThemeName(selectedThematique)}}</div>

      <div class="average_text">{{ selectedBassin ? "Dans ce bassin, chaque commune est couverte" : "Dans ce département, les bassins ont des communes couvertes" }} par <span class="highlight">{{average > 1 ? average.toFixed(0).toLocaleString()+"&nbsp;services" : "moins de 1&nbsp;service" }}</span> pour 100 demandeurs d'emploi en moyenne <span v-if="selectedThematique">pour cette thématique</span></div>
      <div class="top_text" v-if="positiveCount > 0"><span class="highlight">{{ positiveText }}</span> de services que la moyenne</div>
      <div class="flop_text" v-if="negativeCount > 0"><span class="highlight">{{ negativeText }}</span> de services que la moyenne</div>
      <div class="zero_text" v-if="zeroCount > 0"><span class="highlight">{{ zeroText }}</span> couvrant cette thématique</div>

      <div class="legende_text">Services par commune pour 100 demandeurs d'emploi
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
      average: 0,
      thematiques: ["famille","numerique","remobilisation","accompagnement-social-et-professionnel-personnalise","sante","acces-aux-droits-et-citoyennete","handicap","se-former","mobilite","preparer-sa-candidature","logement-hebergement","creation-activite","trouver-un-emploi","gestion-financiere","choisir-un-metier","equipement-et-alimentation","illettrisme","souvrir-a-linternational","apprendre-francais"],
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
                text: 'Services pour 100 demandeurs d\'emploi'
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
    ...mapState(['selectedThematique','selectedBassin', 'selectedDepartement']),
    positiveText(){
      if(this.positiveCount == 1){
        return this.selectedBassin ? this.positiveCount + " commune a plus" : this.positiveCount + " bassin a des communes qui ont moins de"
      }else{
        return this.selectedBassin ? this.positiveCount + " communes ont plus" : this.positiveCount + " bassins ont des communes qui ont plus"
      }
    },
    negativeText(){
      if(this.negativeCount == 1){
        return this.selectedBassin ? this.negativeCount + " commune a moins" : this.negativeCount + " bassin a des communes qui ont moins"
      }else{
        return this.selectedBassin ? this.negativeCount + " communes ont moins" : this.negativeCount + " bassins ont des communes qui ont moins"
      }
    },
    zeroText(){
      if(this.zeroCount == 1){
        return this.selectedBassin ? this.zeroCount + " commune n'a aucun service" : this.zeroCount + " bassin n'a aucun service"
      }else{
        return this.selectedBassin ? this.zeroCount + " communes n'ont aucun service" : this.zeroCount + " bassins n'ont aucun service"
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
          if (populationEntry&&populationEntry.population>0) {
            communeCount[inseeCode] = ((communeCount[inseeCode] / populationEntry.population) * 100).toFixed(1); // Per 1000 inhabitants
          }else{
            communeCount[inseeCode] = 0;
          }
        }
      
      // Sort by normalized count in descending order
      var sortedEntries = Object.entries(communeCount)
      .sort(([, countA], [, countB]) => countB - countA);

      var entriesWithNames

      if(this.selectedBassin){

        var communesList = bassins[this.selectedDepartement][this.selectedBassin];
        sortedEntries = sortedEntries.filter(([insee]) => communesList.includes(insee));

        const average = sortedEntries.reduce((sum, [, count]) => sum + parseFloat(count), 0) / sortedEntries.length;
        this.average = average;

        entriesWithNames = sortedEntries.map(([insee, difference]) => {
          const communeEntry = population.find(entry => entry.insee === insee);
          const communeName = communeEntry ? communeEntry.nom_commune : insee;
          return [communeName, difference];
        });

      }else{

        var bassinsToDisplay = Object.keys(bassins[this.selectedDepartement])

        const bassinsAverages = bassinsToDisplay.map(bassinName => {

          const communesInBassin = bassins[this.selectedDepartement][bassinName];
          
          const relevantCommunes = sortedEntries.filter(([insee]) => communesInBassin.includes(insee));
          
          const average = sortedEntries.reduce((sum, [, count]) => sum + parseFloat(count), 0) / sortedEntries.length;
          this.average = average;

          var bassinAverage = (relevantCommunes.reduce((sum, [, diff]) => sum + parseFloat(diff), 0) / relevantCommunes.length)
          if(bassinAverage > 1){
            bassinAverage = bassinAverage.toFixed(1)
          }else{
            bassinAverage = bassinAverage.toFixed(3)
          }
          
          return [bassinName, bassinAverage];

        }).sort(([,avgA], [,avgB]) => avgB - avgA);

        entriesWithNames = bassinsAverages;
        

      }

      sortedEntries = entriesWithNames;

      // Count number of communes with positive difference
      const positiveCount = sortedEntries.filter(([, diff]) => parseFloat(diff) > this.average).length;
      this.positiveCount = positiveCount;
      const negativeCount = sortedEntries.filter(([, diff]) => parseFloat(diff) < this.average && parseFloat(diff) > 0).length;
      this.negativeCount = negativeCount;
      const zeroCount = sortedEntries.filter(([, diff]) => parseFloat(diff) <= 0).length;
      this.zeroCount = zeroCount;

      // Convert to arrays for chart.js
      const communes = sortedEntries.map(([commune]) => commune);
      const counts = sortedEntries.map(([, count]) => count);
      
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
                  return context.parsed.y + ' services pour 100 demandeurs d\'emploi';
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
                text: 'services pour 100 demandeurs d\'emploi'
              },
              min: 0,
              max: Math.max(1, Math.max(...counts) > 10 ? Math.ceil(Math.max(...counts) / 10) * 10 : Math.max(...counts))
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
  },
}
</script>

<style scoped lang="scss">

</style> 