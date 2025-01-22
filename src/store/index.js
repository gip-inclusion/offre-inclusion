import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    servicesData:undefined,
    endImport:false,
    selectedThematique: null,
  },
  mutations: {
    initializeData (state,data) {
      state.servicesData = data
    },
    endImport(state,value){
      state.endImport = value
    },
    SET_SELECTED_THEMATIQUE(state, theme) {
      state.selectedThematique = theme;
    },
  }
})
