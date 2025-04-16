<template>
    <div id="colorMap" class="map"></div>
  </template>
  
  <script>
  import store from '@/store'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import population from '../../public/data/population.json'

  export default {
    name: 'ColorMap',
    data() {
      return {
        map: null,
        center: [46.3622,1.5231],
        zoom: 8,
        markers: [],
        geojsonLayer: null,
        communesData: null,
        communeCounts: {}
      }
    },
    computed: {
      servicesData() {
        return store.state.servicesData
      },
      selectedThematique() {
        return store.state.selectedThematique
      },
      selectedZoomAndCenter() {
        return store.state.selectedZoomAndCenter
      },
      selectedDepartement() {
        return store.state.selectedDepartement
      }
    },
    methods: {
      initMap() {
        this.colorMap = L.map('colorMap', {
          attributionControl: false,
          zoomControl: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          touchZoom: false,
          dragging: true
        }).setView(this.center, this.zoom)
        
        // Add zoom control to bottom left
        L.control.zoom({
          position: 'bottomleft'
        }).addTo(this.colorMap)
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(this.colorMap)
        this.updateLayer()
      },

      updateLayer(){
        fetch('data/geojson/communes-'+this.selectedDepartement+'.geojson')
        //fetch('https://geo.api.gouv.fr/departements/'+this.selectedDepartement+'/communes')
          .then(response => response.json())
          .then(data => {
            this.communesData = data
            this.updateChoropleth()
          })
      },
  
      getColor(count) {
        // Return white if count is 0
        if (count === 0) {
          return '#E6E6EB';
        }

        // Define min and max values for the scale
        const minCount = 0;
        const maxCount = Math.max(...Object.values(this.communeCounts), 5);  // Use actual maximum, with 150 as minimum max
        
        // Ensure count is within bounds
        count = Math.min(Math.max(count, minCount), maxCount);
        
        // Calculate the percentage between min and max
        const percentage = (count - minCount) / (maxCount - minCount);
        
        // Convert hex colors to RGB
        const startColor = {
          r: 99,
          g: 174,
          b: 251
        };
        
        const endColor = {
          r: 0,
          g: 30,
          b: 61
        };
        
        // Linear interpolation between colors
        const r = Math.round(startColor.r + (endColor.r - startColor.r) * percentage);
        const g = Math.round(startColor.g + (endColor.g - startColor.g) * percentage);
        const b = Math.round(startColor.b + (endColor.b - startColor.b) * percentage);
        
        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      },
  
      updateChoropleth() {
        if (this.geojsonLayer) {
          this.geojsonLayer.remove()
        }
  
        if (!this.communesData || !this.servicesData) return
        // Count services per commune using INSEE code, filtering by thematique
        this.communeCounts = {}  // Store as instance property so getColor can access it
        this.servicesData.forEach(service => {
          const thematiques = Array.isArray(service.Thematiques) ? service.Thematiques : [service.Thematiques];
          // Only count service if it matches the selected thematique or if no thematique is selected
          if(service.Source != 'fredo'){
            if (!this.selectedThematique || thematiques.some(t => t.includes(this.selectedThematique))) {
              const inseeCode = service['Code Insee']
              if (inseeCode) {
                this.communeCounts[inseeCode] = (this.communeCounts[inseeCode] || 0) + 1
              }
            }
          }
        })

        // Normalize counts by population
        for (const inseeCode in this.communeCounts) {
          const populationEntry = population.find(entry => entry.insee === inseeCode);
          if (populationEntry&&populationEntry.population>0) {
            this.communeCounts[inseeCode] = (this.communeCounts[inseeCode] / populationEntry.population) * 100; // Per 1000 inhabitants
          }
        }
        
        this.geojsonLayer = L.geoJSON(this.communesData, {
          style: (feature) => {
            const inseeCode = feature.properties.com_code[0]
            return {
              fillColor: this.getColor(this.communeCounts[inseeCode] || 0),
              weight: 1,
              opacity: 1,
              color: 'white',
              dashArray: '0',
              fillOpacity: 1
            }
          },
          onEachFeature: (feature, layer) => {
            const inseeCode = feature.properties.com_code[0]
            const communeName = feature.properties.com_name_upper
            const serviceCount = this.communeCounts[inseeCode] || 0
            layer.bindTooltip(
              `${communeName}<br> ${serviceCount.toFixed(2)} services pour 100 demandeurs d'emploi`
            )
          }
        }).addTo(this.colorMap)
      },
  
      updateMarkers() {
        this.markers.forEach(marker => marker.remove())
        this.markers = []
        this.updateLayer()
      },
      updateMapZoomAndCenter() {
        const { zoom, center } = this.selectedZoomAndCenter;
        this.colorMap.flyTo(center, zoom);
      }
    },
    watch: {
      servicesData: {
        handler: 'updateMarkers',
        deep: true
      },
      selectedThematique: {
        handler: 'updateMarkers'
      },
      selectedZoomAndCenter: {
        deep: true,
        handler: 'updateMapZoomAndCenter'
      }
    },
    mounted() {
      this.initMap()
    },
    beforeDestroy() {
      if (this.colorMap) {
        this.colorMap.remove()
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style> 