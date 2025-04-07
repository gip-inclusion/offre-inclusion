<template>
  <div id="symbolMap" class="map"></div>
</template>

<script>
import store from '@/store'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import bassins from '../../public/data/bassins.json'

export default {
  name: 'SymbolMap',
  data() {
    return {
      map: null,
      center: [46.3622,1.5231],
      zoom: 8,
      markers: [],
      servicesBlacklist:["Hub-lo_247-mediation-numerique","Hub-lo_313-mediation-numerique","Hub-lo_293-mediation-numerique","Mednum-BFC_mednumBFC_TL_360_-mediation-numerique","Hub-lo_76-mediation-numerique","Hub-lo_147-mediation-numerique","Hub-lo_192-mediation-numerique","Hub-lo_349-mediation-numerique","530ed428-ec68-5701-408e-7e7063578598","Mednum-BFC_mednumBFC_TL_534_-mediation-numerique","Hub-lo_417-mediation-numerique","b9d94234-2bdb-4caa-a541-45fa83406882","Nouvelle-Calédonie_66-mediation-numerique","Hub-Bretagne_935-mediation-numerique","Hub-Bretagne_1883__Hub-Bretagne_1915-mediation-numerique","ac995056-9612-e264-a78e-bb5877458ecf","a6a5c9d6-b995-4dac-9b23-b5dc94ae3da8","5d48cae5-c30d-4a8b-8e10-e125645cce5c","4630cf6c-31ec-e530-b7cd-a5221821ea55","Hinaura_CentreSocialMartinLutherKingDeLivron3-mediation-numerique","Fibre-64_37-mediation-numerique","La-Creuse_26-mediation-numerique","15_1397120","15_1397959","15_1400114","Aidants-Connect_59b66a81-dbc5-4be3-80ab-862d1e63bb14-mediation-numerique","15_1386576","15_1346378","Coop-numérique_72033070-1a30-47c3-9b75-19bf656285d0-mediation-numerique","e7682d62-e897-46df-b4d0-31f39e482366","e555b871-3a0e-487f-b24c-06cca575e647"]
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
    selectedBassin() {
      return store.state.selectedBassin
    },
    selectedDepartement() {
      return store.state.selectedDepartement
    }
  },
  methods: {
    initMap() {
      this.symbolMap = L.map('symbolMap', {
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
      var zoom = this.symbolMap.getBoundsZoom(bounds, false)
      if(zoom > 11){
        zoom = 11
      }
      return {
        center: bounds.getCenter(),
        zoom: zoom
      }
    },

    updateMarkers() {
      this.markers.forEach(marker => marker.remove())
      this.markers = []
      var communesList = bassins[this.selectedDepartement][this.selectedBassin]
      var listOfServices 
      if(this.selectedBassin){
        listOfServices = this.servicesData.filter(service => service["Code Insee"] && communesList.includes(service["Code Insee"]))
      }else{
        listOfServices = this.servicesData
      }
      if (listOfServices && listOfServices.length > 0 && Array.isArray(listOfServices)) {
        listOfServices.forEach(item => {
          const thematiques = Array.isArray(item.Thematiques) ? item.Thematiques : [item.Thematiques];
          if (item.Latitude && item.Longitude && 
              (!this.selectedThematique || thematiques.some(t => t.includes(this.selectedThematique)) ) && item.Source != 'fredo' && !this.servicesBlacklist.includes(item["ID"])) {
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
              .bindTooltip(item.Nom.toUpperCase() + '<br>' + item.Commune)
              .on('click', () => console.log(item["ID"]))
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
    selectedBassin: {
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