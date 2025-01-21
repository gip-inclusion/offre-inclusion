<template>
  <div id="vueTerritoire">
    <h2>Le territoire est-il couvert de manière équilibrée ?</h2>
    <div class="filters_selector">
      <h4>Sélectionnez une thématique</h4>
      <div class="filters_box">Thématique
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.99999 9.99997L5.17133 7.1713L6.11466 6.22864L7.99999 8.11464L9.88533 6.22864L10.8287 7.1713L7.99999 9.99997Z" fill="black"/></svg>
      </div>
    </div>
    <div id="map" style="height: 500px;width:500px;"></div>
     <!-- {{servicesData}} -->
  </div>
</template>

<script>
import store from '@/store'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'VueTerritoire',
  data(){
    return {
      map: null,
      center: [-21.120531560155037, 55.52042536869871],
      zoom: 10,
      markers: []
    }
  },
  props: {
  },
  computed: {
     servicesData() {
      return store.state.servicesData
    },
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView(this.center, this.zoom)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(this.map)
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
              fillColor: '#0000ff',
              color: '#0000ff',
              weight: 1,
              opacity: 0.5,
              fillOpacity: 0.5
            })
              .bindTooltip(item.Nom)
              .addTo(this.map)
            this.markers.push(marker)
          }
        })
      }
      console.log(this.markers)
    }
  },

  watch: {
    servicesData: {
      handler: 'updateMarkers',
      deep: true
    }
  },

  created(){
    console.log("vueTerritoire created")
  },

  mounted() {
    this.initMap()
  },

  beforeDestroy() {
    if (this.map) {
      this.map.remove()
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  
  /* overload fonts path, to delete when parent has access */
  @import "../../css/overload-fonts.css";
  @import '~leaflet/dist/leaflet.css';

  span{
    color:red;
  }

  @media (max-width: 728px) {
    span{
      color:blue;
    }    
  }


</style>
