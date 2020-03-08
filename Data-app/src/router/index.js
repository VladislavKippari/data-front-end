import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import RoomInfo from '../components/roomChart/RoomInfo';
Vue.use(Router)

export const routes = [
    { path: '/rooms', component: Home },
    {path:'/roominfo',component: RoomInfo},
    
    {path:'*',redirect:'/rooms'},
    

   
];
