<template>
  <div class="footer">
    <span class="textColor">"{{quotes[1]}}"</span>
    
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