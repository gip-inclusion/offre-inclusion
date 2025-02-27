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
      center: [46.3622,1.5231],
      zoom: 8,
      markers: []
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
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(this.symbolMap)
      this.updateMarkers()
      
    },

    getMapBounds() {
      if (!this.markers || this.markers.length === 0) {
        return {
          center: this.center,
          zoom: this.zoom
        }
      }

      const validCoordinates = this.markers.map(marker => marker.getLatLng());
      const bounds = L.latLngBounds(validCoordinates);
      return {
        center: bounds.getCenter(),
        zoom: this.symbolMap.getBoundsZoom(bounds, false)
      }
    },

    updateMarkers() {
      this.markers.forEach(marker => marker.remove())
      this.markers = []
      if (this.servicesData && Array.isArray(this.servicesData)) {
        this.servicesData.forEach(item => {
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

        const { center, zoom } = this.getMapBounds();
        store.commit('SET_SELECTED_ZOOM_AND_CENTER', { zoom, center });
      }
    },
    updateMapZoomAndCenter() {
      const { zoom, center } = this.selectedZoomAndCenter;
      this.symbolMap.flyTo(center, zoom);
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
    if (this.symbolMap) {
      this.symbolMap.remove()
    }
  }
}
</script>

<style scoped lang="scss">

</style> 