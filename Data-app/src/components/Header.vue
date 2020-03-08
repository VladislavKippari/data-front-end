<template>
<div >
<div class="logo" v-on:mouseover="hoverOver" v-on:mouseout="hoverOut">
 <router-link to="/rooms"   tag="a"><a > <img :class="classes"  src="../assets/ttlogo.png" height="71"></a></router-link >
</div>
<nav id="nav-3">
<router-link to="/rooms" activeClass="active" tag="a"><a class="link-3" >Rooms</a> </router-link >
<router-link to="/roominfo" activeClass="active" tag="a"><a class="link-3" >Room info</a> </router-link >
<router-link to="/controllers" activeClass="active" tag="a"><a class="link-3" >Controllers</a> </router-link >
<router-link to="/sensors" activeClass="active" tag="a"><a class="link-3" >Sensors</a> </router-link >
</nav>
</div>


    

    

</template>
<script>
export default {
    data(){
      return{
        classes: []
      }
    },methods: {
  	hoverOver() {
    
    	this.classes = ['animated', 'rubberBand']
    },
    hoverOut() {
    
    	this.classes = []
    },
    
  }
}
</script>


<style scoped>


.bar img{
 
float: left;
}

body {
  margin: 0px;
}
a{
  outline: 0;
}
#nav-3 a{
    text-decoration: none;
      outline: 0;
      font-size: 25px;
}
nav {
   border-radius: 7px;
  padding: 24px;
  text-align: center;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

#nav-3 {
  background: #E4067F;
}



.link-3 {
  transition: 0.4s;
  color: #ffffff;
  font-size: 20px;
  text-decoration: none;
  padding: 15px 15px;
  margin: 0 10px;
}
.link-3:hover {
  background-color: #ffffff;
  color: #E4067F;
  padding: 24px 15px;
}

.logo img{
text-align: center;
 display: block;
position: absolute;
}

  .active a{
     transition: 0.5s;
 
  text-decoration: none;
 
  
  color: white;
  
  border-bottom: 3px solid dodgerblue;
  }

</style>