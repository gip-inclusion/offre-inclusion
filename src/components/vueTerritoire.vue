<template>
  <div id="vueTerritoire">
    <h2>Le territoire est-il couvert de manière équilibrée ?</h2>
    <div class="filters_selector">
      <h4>Sélectionnez une thématique</h4>
      <div class="filters_box">Thématique
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.99999 9.99997L5.17133 7.1713L6.11466 6.22864L7.99999 8.11464L9.88533 6.22864L10.8287 7.1713L7.99999 9.99997Z" fill="black"/></svg>
      </div>
    </div>
     <!-- {{myData}} -->
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'VueTerritoire',
  data(){
    return {
    }
  },
  props: {
  },
  computed: {
     myData() {
      return store.state.myData
    },
  },
  methods: {
  },

  watch:{
  },

  created(){
    console.log("vueTerritoire created")
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  
  /* overload fonts path, to delete when parent has access */
  @import "../../css/overload-fonts.css";

  span{
    color:red;
  }

  @media (max-width: 728px) {
    span{
      color:blue;
    }    
  }


</style>
