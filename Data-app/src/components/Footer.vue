<template>
  <div class="footer">
    "{{quotes[1]}}"
    
    <br/><strong>{{quotes[2]}}</strong>
    <strong v-if='quotes[2]===""'>Unknown</strong>
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
    this.$http
      .get("https://quote-garden.herokuapp.com/quotes/random")
      .then(response => {
        return response.json();
      })
      .then(data => {
        const resultArray = [];
        for (let key in data) {
          resultArray.push(data[key]);
        }
        this.quotes = resultArray;
        console.log(this.quotes);
      });
  }
};
</script>
<style scoped>
.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  height: 35px;
  padding: 1rem;
  background-color: rgba(30, 143, 255, 0.685);
  text-align: left;
}
.ga_sep{
    
    
    position: relative;
    display:inline;
    float: right;
}

</style>