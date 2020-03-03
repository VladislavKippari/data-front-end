<template>


 <div v-on:mouseleave="hover = false" class="  animated flipInX">
        
             
    <div v-on:mouseover="hover = true" v-if="!hover" class="item fontb" key="{{room}}">{{room}}</div>
   <router-link class="nodecor" v-bind:to="'/rooms/'+ room">   <div   v-on:click="selectedRoom(room)"  v-on:mouseleave="hover = false" v-if="hover" class="item colr animated jello" key="{{valuetype}}"> 
     
     
        <section>
            <div class="block centr">  {{room}} </div>
    <div class="block ">{{valuetype1}} - {{value1}} {{dimension1}}</div>
    <div class="block">{{valuetype2}} - {{value2}} {{dimension2}}</div>
    <div class="block">{{valuetype3}} - {{value3}} {{dimension3}}</div>
  </section>
       
       </div>

  </router-link> 
      </div>
</template>
<script>

import {mapMutations} from 'vuex';

export default {
  data(){
    return{
     
 hover:false
    }
  },
  props: ["room","valuetype1","value1","dimension1","valuetype2","value2","dimension2","valuetype3","value3","dimension3"],
  methods:{
    
       ...mapMutations([
          'selectedRoom'
       ])
    
  }
};
</script>

<style  scoped>
.nodecor{
  text-decoration: none;
}
.item {
  background-color: rgba(30, 143, 255, 0.685);
  color: white;
  height: 200px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  animation-duration: 485ms;
  animation-iteration-count: 1;
  font-family: Raleway;
  font-weight: 900;
  border-radius: 25px;
  
}
.fontb{
  font-size: 32px;
  

}
.colr{
  background-color: #8eeb93e1;
}
.centr{
  text-align: center;
  font-weight: 900;
  font-size: 25px;
    color:#E4067F !important;
}
section {
  display: flex;
  flex-direction: column;
}

.block {
  width: 200px;
  height: 40px;
 
 color: black;
 text-align: center ;
 font-weight: 700 important!;


}




</style>
