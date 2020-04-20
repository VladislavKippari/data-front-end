<template>
  <div>
    <slot gridClass="wrapper"></slot>
  </div>
</template>

<script>
export default {
 
};
</script>

<style  scoped>
.wrapper {
  display: grid;
  grid-auto-columns: 1fr;
  grid-gap: 50px;
  padding: 40px;
 
}
@media all and (max-width: 10000px) {
  .wrapper {
    grid-template-areas: "x x x x ";
  }
}
@media all and (max-width: 1366px) {
  .wrapper {
    grid-template-areas: "x x x x";
  }
}
@media all and (max-width: 800px) {
  .wrapper {
    grid-template-areas: "x x x";
  }
}
@media all and (max-width: 600px) {
  .wrapper {
    grid-template-areas: "x x ";
  }
}
@media all and (max-width: 400px) {
  .wrapper {
    grid-template-areas: "x ";
    
  }
}
</style>