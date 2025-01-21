<template>
    <div id="colorMap" class="map"></div>
  </template>
  
  <script>
  import store from '@/store'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  
  export default {
    name: 'ColorMap',
    data() {
      return {
        map: null,
        center: [-21.120531560155037, 55.52042556869871],
        zoom: 10,
        markers: [],
        geojsonLayer: null,
        communesData: null
      }
    },
    computed: {
      servicesData() {
        return store.state.servicesData
      },
    },
    methods: {
      initMap() {
        this.colorlMap = L.map('colorMap', {attributionControl: false}).setView(this.center, this.zoom)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(this.colorlMap)
        
        fetch('data/geojson/communes-974-la-reunion.geojson')
          .then(response => response.json())
          .then(data => {
            this.communesData = data
            this.updateChoropleth()
          })
      },
  
      getColor(count) {
        // Define min and max values for the scale
        const minCount = 0;
        const maxCount = 20;
        
        // Ensure count is within bounds
        count = Math.min(Math.max(count, minCount), maxCount);
        
        // Calculate the percentage between min and max
        const percentage = (count - minCount) / (maxCount - minCount);
        
        // Convert hex colors to RGB
        const startColor = {
          r: 0x99,
          g: 0x99,
          b: 0xff
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
  
        // Count services per commune using INSEE code
        const communeCounts = {}
        this.servicesData.forEach(service => {
          const inseeCode = service['Code Insee']
          if (inseeCode) {
            communeCounts[inseeCode] = (communeCounts[inseeCode] || 0) + 1
          }
        })
  
        this.geojsonLayer = L.geoJSON(this.communesData, {
          style: (feature) => {
            const inseeCode = feature.properties.code
            return {
              fillColor: this.getColor(communeCounts[inseeCode] || 0),
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
            layer.bindTooltip(
              `${communeName}: ${communeCounts[inseeCode] || 0} services`
            )
          }
        }).addTo(this.colorlMap)
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
      }
    },
    mounted() {
      this.initMap()
    },
    beforeDestroy() {
      if (this.colorlMap) {
        this.colorlMap.remove()
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style> 