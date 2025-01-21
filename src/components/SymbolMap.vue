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
  },
  methods: {
    initMap() {
      this.symbolMap = L.map('symbolMap', {attributionControl: false}).setView(this.center, this.zoom)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(this.symbolMap)
      this.updateMarkers()
    },

    updateMarkers() {
      this.markers.forEach(marker => marker.remove())
      this.markers = []

      if (this.servicesData && Array.isArray(this.servicesData)) {
        this.servicesData.forEach(item => {
          if (item.Lat && item.Long) {
            var lat = "-"+item.Lat.replace(',', '.')
            var long = item.Long.replace(',', '.')
            const marker = L.circleMarker([lat, long], {
              radius: 5,
              fillColor: '#000091',
              color: '#000091',
              weight: 1,
              opacity: 0.2,
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