<template>
  <div class="footer">
  
     <div class="ga_sep"> Contact:
  
    <strong>kippari.v@gmail.com</strong></div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      quotes: []
    };
  },
  created() {
  
  }
};
</script>
<style scoped>
.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background-color: dodgerblue;
  text-align: left;
  
  z-index: 10000000;

}
.ga_sep{
    
    padding-right: 5px;
    position: relative;
    display:inline;
    float: right;
}
.textColor{
  color: white;
}

</style>