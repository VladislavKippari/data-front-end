<template>
 <div class="body">
        <app-header></app-header>
         <router-view class="test"></router-view>
         <app-footer></app-footer>
    </div>
</template>

<script>
import Header from './components/Header';
import Footer from './components/Footer';

 
export default {
  components:{
'app-header':Header,
'app-footer':Footer

  }
};
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Raleway);

*{
    font-family: Raleway;
}
.body {
  margin-right: auto;
  margin-left:  auto;
  max-width: 1200px;
  padding-right: 10px;
  padding-left:  10px;
  margin-bottom: 35px;
}
.test{
  padding-bottom:50px; 
 

}
</style>
