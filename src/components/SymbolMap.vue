<template>
  <div id="symbolMap" class="map"></div>
</template>

<script>
import store from '@/store'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'SymbolMap',
  data() {
    return {
      map: null,
      center: [-21.120531560155037, 55.52042536869871],
      zoom: 10,
      markers: []
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
      this.symbolMap = L.map('symbolMap', {
        attributionControl: false,
        zoomControl: false  // Disable default zoom control
      }).setView(this.center, this.zoom)
      
      // Add zoom control to bottom left
      L.control.zoom({
        position: 'bottomleft'
      }).addTo(this.symbolMap)
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(this.symbolMap)
      this.updateMarkers()
    },

    updateMarkers() {
      this.markers.forEach(marker => marker.remove())
      this.markers = []

      if (this.servicesData && Array.isArray(this.servicesData)) {
        this.servicesData.forEach(item => {
          // Convert Thematiques to array if it's a string
          const thematiques = Array.isArray(item.Thematiques) ? item.Thematiques : [item.Thematiques];
          if (item.Latitude && item.Longitude && 
              (!this.selectedThematique || thematiques.some(t => t.includes(this.selectedThematique)) ) && item.Source != 'fredo') {
            var lat = item.Latitude
            var long = item.Longitude
            const marker = L.circleMarker([lat, long], {
              radius: 5,
              fillColor: '#0078f3',
              color: '#0078f3',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.2
            })
              .bindTooltip(item.Nom)
              .addTo(this.symbolMap)
            this.markers.push(marker)
          }
        })
      }
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
    if (this.symbolMap) {
      this.symbolMap.remove()
    }
  }
}
</script>

<style scoped lang="scss">

</style> 