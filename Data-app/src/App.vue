<template>
 <div class="body">
        <app-header></app-header>
         <router-view></router-view>
    </div>
</template>

<script>
import Header from './components/Header';


export default {
  components:{
'app-header':Header

  }
};
</script>

<style>
.body {
  margin-right: auto;
  margin-left:  auto;
  max-width: 1200px;
  padding-right: 10px;
  padding-left:  10px;
}
</style>
