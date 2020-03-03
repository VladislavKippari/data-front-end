import Vue from 'vue';
import Vuex from 'vuex';
import mutations  from './modules/mutations';

Vue.use(Vuex);
export  default new Vuex.Store({
    modules:{
        mutations
    }
});