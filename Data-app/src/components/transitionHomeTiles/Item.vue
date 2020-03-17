<template>


 <div class="animated flipInX " v-on:mouseout="hoverOut" >
        
    <div  v-on:mouseenter="hover = true" v-if="!hover" class="item fontb nodecor" key="{{room}}">{{room}}</div>
   <router-link class="nodecor " activeClass="active" to="/roominfo"   >   <div v-on:mouseover="hoverOver"  v-on:mouseleave="hover = false" v-on:mouseenter="hover = true"  v-on:click="selectedRoom(room)"  v-if="hover" :class="['item', 'colr',classes]" key="{{valuetype}}"> 
     
     
        <section >
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
    classes:[],
 hover:false
    }
  },
  props: ["room","valuetype1","value1","dimension1","valuetype2","value2","dimension2","valuetype3","value3","dimension3"],
  methods:{
    
       ...mapMutations([
          'selectedRoom'
       ]),
       hoverOver() {
    
      this.classes = ['animated', 'jello slow']
    },
    hoverOut() {
    
    	this.classes = [];
    }
    
  },watch:{
    hover(){
      console.log(this.hover)
    }
  },created(){
          console.log(this.hover)

  }
};
</script>

<style  scoped>
.nodecor{
  text-decoration: none;
}
*:focus{
    outline: none;

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
