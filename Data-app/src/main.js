import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import { routes } from './router/index';
import store from './store/store';
import vSelect from 'vue-select';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueResource);
Vue.component('v-select', vSelect)
Vue.component('custom-select', {
  extends: vSelect,
  methods: {
    maybeAdjustScroll: () => false
  }
})
Vue.http.interceptors.push((request, next) => {
  NProgress.start();
  next((response)=>{
      NProgress.done();
    });
});
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
