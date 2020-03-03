<template>
<div>
  <div class="chosing" v-if="choice">
  <div>Select graph data period</div>
  <button class="btnselect" v-on:click="monthly=true;choice=false;">Months</button>
  <button class="btnselect" v-on:click="byHours=true;choice=false;">Hours</button>
  </div>
<div v-if="byHours">
  </div>
<div v-if="monthly">
    <datepicker :format="customFormatter" v-model.lazy="dateStart"  :disabled-dates="disabledDates"></datepicker>
    <datepicker :format="customFormatter" v-model.lazy="dateEnd"  :disabled-dates="disabledDates"></datepicker>
    <div>{{moment(dateStart).format('MMM/DD/YY')}}</div>
    
    <div>Stored {{storedRoom}}</div>
     <div class="controller-wrapper second animated slideInRight">
        <custom-select
          v-model.lazy="selectedValueType"
         
          placeholder="Value type ..."
          class="style-chooser"
         
         :options="valueTypeArr"
        ></custom-select>
      </div>
    <div id="content">
     
     <Chart
        ref="skills_chart"
        :chart-data="chartData"
        :options="options">
      </Chart>
    </div>
 </div>
  </div>
</template>

<script>
import Chart from './Chart'

import vSelect from 'vue-select';
import "vue-select/dist/vue-select.css";
import Datepicker from 'vuejs-datepicker';
var moment=require('moment');
const options = {
  responsive: true, 
  maintainAspectRatio: false, 
  animation: {
    animateRotate: false
  }
}
export default {
  
  components: {
      vSelect,
      Datepicker,
      Chart
    },
  name: "app",
  data() {
    return {
      storedRoom:'',
      dateStart:'',
      dateEnd:'',
      hoursStart:'',
      hoursEnd:'',
      monthly:false,
      byHours:false,
      choice:true,
      moment,
      valueTypeArr:[],
      selectedValueType:'',
      dataForGraph:[],
      dataLabel:[],
      dataGraph:[],
     options, 
        chartData: {
        labels: [],
        datasets: [
          {
           
            data: []
          }
        ]
      },
     
      disabledDates: {
    to: new Date(2019, 11, 25), // Disable all dates up to specific date
    from: new Date(Date.now()), // Disable all dates after specific date
   
  }
      
      
      
    };
  }
  ,computed: {
    currentDataSet () {
      return this.chartData.datasets[0].data
    }
  },
  watch:{
    dateStart(){
     this.intervalData();
      
    },
    dateEnd(){
     this.intervalData();
       
          
    },
    selectedValueType(){
     this.intervalData();
     console.log(this.selectedValueType);
     if(this.selectedValueType===null){
      console.log('lul');
       this.dataGraph=[];
       this.dataLabel=[];
      this.refreshChart();
     }
    }
  },
  methods: {
    
    updateChart () {
      this.$refs.skills_chart.update();
    },
    refreshChart() {
      const currentDataset = this.chartData.datasets[0]
      this.chartData.labels=this.dataLabel
      console.log('last push')
      currentDataset.data=this.dataGraph;
      this.updateChart();
    },
     
   async intervalData(){
     try{

     
        if(this.dateStart!=='' && this.dateEnd!==''){
       await this.$http
      .get('http://localhost:3000/api/data/room/interval/'+moment(this.dateStart).format('MMM DD YY') +'/'+moment(this.dateEnd).format('MMM DD YY') +'')
      .then(response => {
        return response.json();
      })
      .then(data => {
        const resultArray = [];
        for (let key in data) {
          resultArray.push(data[key]);
        }
      
       this.dataChart=resultArray[1];

      });
        
            

      }}catch(error){
        console.log(error);
      }
      console.log(this.dataChart);
      if(this.dateStart!=='' && this.dateEnd!=='' && this.selectedValueType!=='' && this.selectedValueType!==null){
        
          let filtered = this.dataChart;
              
      
      if (this.selectedValueType) {
        filtered = this.dataChart.filter(
          m => m.valuetype.toLowerCase()===this.selectedValueType.toLowerCase()
        );
      }
     

      
      if (this.storedRoom) {
        filtered = filtered.filter(
          m => m.room.toLowerCase()===this.storedRoom.toLowerCase()
        );
      }
    
      
      console.log(filtered);
      filtered.sort(function(a, b) {return a[2] - b[2];});


     
      var temp=filtered;
      this.dataGraph=[];
      this.dataLabel=[];
      for (let index = 0; index < temp.length; index++) {
        this.dataGraph.push(temp[index].data);
        this.dataLabel.push(temp[index].date);
      
      
      }
        this.refreshChart();
      }

    },
       customFormatter(date) {
      return moment(date).format('MMM/DD/YY');
    }
    
      
    },
   
    
    
    
   
  
  created() {
     
this.storedRoom= this.$store.getters.giveroom;
      
     
    this.$http
      .get("http://localhost:3000/api/valuetypes")
      .then(response => {
        return response.json();
      })
      .then(data => {
        const resultArray = [];
        for (let key in data) {
          resultArray.push(data[key]);
          
        }
        var count=0;
       for (let index = 0; index < resultArray[1].length; index++) {
        
         if(resultArray[1][index].valuetype==='Illuminance' && count===0){
          this.valueTypeArr.push(resultArray[1][index].valuetype);    

         }else if(resultArray[1][index].valuetype!=='Illuminance' ){
          this.valueTypeArr.push(resultArray[1][index].valuetype);    
         }
          if(resultArray[1][index].valuetype==='Illuminance'){
            count++;
         }
       }
     
      });
  
  } 
};
</script>

<style scoped>
.style-chooser .vs__search::placeholder,
  .style-chooser .vs__dropdown-toggle,
  .style-chooser .vs__dropdown-menu {
    background: #dfe5fb;
    border: none;
    color: #394066;
    text-transform: lowercase;
    font-variant: small-caps;
    height: 50px;
    width: 50px;
  }
body {
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
  text-rendering: optimizelegibility;
  -moz-osx-font-smoothing: grayscale;
  -moz-text-size-adjust: none;
}

h1,.muted {
  color: #2c3e5099;
}

h1 {
  font-size: 26px;
  font-weight: 600;
}

#app {
  max-width: 30em;
  margin: 1em auto;
}
#content {
  margin: auto;
  width: 1024px;
  background-color: #ffffff;
  padding: 20px;
}
.btnselect{
  display: inline-block;
}
</style>