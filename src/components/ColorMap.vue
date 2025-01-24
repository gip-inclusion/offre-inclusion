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
        center: [-21.120531560155037, 55.52042556869871],
        zoom: 10,
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
      }
    },
    methods: {
      initMap() {
        this.colorMap = L.map('colorMap', {
          attributionControl: false,
          zoomControl: false  // Disable default zoom control
        }).setView(this.center, this.zoom)
        
        // Add zoom control to bottom left
        L.control.zoom({
          position: 'bottomleft'
        }).addTo(this.colorMap)
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(this.colorMap)
        fetch('data/geojson/communes-974-la-reunion.geojson')
          .then(response => response.json())
          .then(data => {
            this.communesData = data
            this.updateChoropleth()
          })
      },
  
      getColor(count) {
        // Return white if count is 0
        if (count === 0) {
          return '#FFFFFF';
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
          r: 0xFF,  // Changed to white (255, 255, 255)
          g: 0xFF,
          b: 0xFF
        };
        
        const endColor = {
          r: 0x00,
          g: 0x00,
          b: 0x91
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
          if (populationEntry) {
            this.communeCounts[inseeCode] = (this.communeCounts[inseeCode] / populationEntry.population) * 10000; // Per 1000 inhabitants
          }
        }
        
        this.geojsonLayer = L.geoJSON(this.communesData, {
          style: (feature) => {
            const inseeCode = feature.properties.code
            return {
              fillColor: this.getColor(this.communeCounts[inseeCode] || 0),
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            }
          },
          onEachFeature: (feature, layer) => {
            const inseeCode = feature.properties.code
            const communeName = feature.properties.nom
            const serviceCount = this.communeCounts[inseeCode] || 0
            layer.bindTooltip(
              `${communeName}: ${serviceCount.toFixed(2)} services pour 10 000 habitants`
            )
          }
        }).addTo(this.colorMap)
      },
  
      updateMarkers() {
        this.markers.forEach(marker => marker.remove())
        this.markers = []
        this.updateChoropleth()
      }
    },
    watch: {
      servicesData: {
        handler: 'updateMarkers',
        deep: true
      },
      selectedThematique: {
        handler: 'updateMarkers'
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