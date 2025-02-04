import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    servicesData:undefined,
    structuresData:undefined,
    endImport:false,
    selectedThematique: null,
  },
  mutations: {
    initializeData (state,data) {
      state.servicesData = data
    },
    initializeStructuresData (state,data) {
      state.structuresData = data
    },
    endImport(state,value){
      state.endImport = value
    },
    SET_SELECTED_THEMATIQUE(state, theme) {
      state.selectedThematique = theme;
    },
  }
})
