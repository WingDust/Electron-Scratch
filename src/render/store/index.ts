// import Vue from 'vue'
import {createStore} from 'vuex'

import { state } from "./state";
import { mutations } from "./mutations";



export const store = createStore({
  state:state,
  mutations:mutations,
  actions: {
  },
  getters: {
  },
  modules: {}
})


export type State = typeof store
