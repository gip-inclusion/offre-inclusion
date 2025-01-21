<template>
  <div id="vueTerritoire">
    <h2>Le territoire est-il couvert de manière équilibrée ?</h2>
    <div class="filters_selector">
      <h4>Sélectionnez une thématique</h4>
      <div class="filters_box">Thématique
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.99999 9.99997L5.17133 7.1713L6.11466 6.22864L7.99999 8.11464L9.88533 6.22864L10.8287 7.1713L7.99999 9.99997Z" fill="black"/></svg>
      </div>
    </div>
    <div id="maps_wrapper">

      <div class="map_container">
        <div class="map_title">Les services sont principalement implantés dans les communes principales du département...</div>
        <SymbolMap />
      <div class="map_legend">Géolocalisation des services</div>
      </div>

      <div class="map_container">
        <div class="map_title">... mais par rapport à leur population, elles sont moins bien loties que leurs voisines</div>
        <ColorMap />
        <div class="map_legend">Nombre de services  pour 10 000 habitants par commune</div>
      </div>

  </div>
    
  </div>
  
</template>

<script>
import SymbolMap from './SymbolMap.vue'
import ColorMap from './ColorMap.vue'
export default {
  name: 'VueTerritoire',
  components: {
    SymbolMap,
    ColorMap
  },
  created(){
    console.log("vueTerritoire created")
  }
}
</script>

<style scoped lang="scss">
@import "../../css/overload-fonts.css";

#maps_wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 150px;
  .map_container {
  width: 500px;
  height: 500px;
  display: inline-block;
  .map_title {
    font-family: Marianne;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    color:#000638;
    margin-bottom: 10px;
  }
  .map {
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
  }
  .map_legend {
    font-family: Marianne;
    font-size: 16px;
    font-style: italic;
    font-weight: 400;
    line-height: 24px;
  }
}
}


@media (max-width: 728px) {
  span {
    color: blue;
  }    
}
</style>
