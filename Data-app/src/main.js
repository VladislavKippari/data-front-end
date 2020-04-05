import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import { routes } from './router/index';
import store from './store/store';
import vSelect from 'vue-select';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Pusher from 'pusher-js';
import { ToggleButton } from 'vue-js-toggle-button'

Vue.component('ToggleButton', ToggleButton)
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

Pusher.logToConsole = true;
console.log('are you here')
   var pusher = new Pusher('bd5d7310044a12129c50', {
      cluster: 'eu',
      forceTLS: true
    });
    
    var count=0;
    var sensorDuplicate=0;
    var dateCheck;
    
   var channel = pusher.subscribe('watch_datasensor4');
    channel.bind('my-event', function(data) {
          console.log(JSON.stringify(data))
       if(count===0){
        dateCheck=new Date(Date.parse(data.date));
        var testi=new Date;
         console.log('IF');
        console.log(testi.getMinutes()-dateCheck.getMinutes());
        count++
        
      }else if ((new Date(Date.parse(data.date)).getMinutes()-dateCheck.getMinutes())>3){
        console.log('ELSE');
       
        console.log(new Date(Date.parse(data.date)).getMinutes()-dateCheck.getMinutes());
       
         store.commit('triggerClear');
         
        sensorDuplicate=0;
        dateCheck=new Date(Date.parse(data.date));
        
      }
        console.log(JSON.stringify(data))
        store.commit('triggerFill',data);
       
        if(data.room==='208' && data.valuetype==='Lumen'){

          if(sensorDuplicate>0){
          store.commit('triggerSplice');
            console.log('removed');
          }
          sensorDuplicate++;
        } 
            
         
    });
    
  
new Vue({
  el: '#app',
  
  router,
  store,
  components: { App },
  template: '<App/>'
})
