import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import { routes } from './router/index';
import store from './store/store';
import vSelect from 'vue-select';

Vue.use(VueResource);

Vue.component('v-select', vSelect)
Vue.component('custom-select', {
  extends: vSelect,
  methods: {
    maybeAdjustScroll: () => false
  }
})


const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
