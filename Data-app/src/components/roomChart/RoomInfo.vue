<template>
  <div class="body">
    <div class="chosing" v-if="choice">
      <div class="heading">Data filtering</div>
      <button
       class="margn btnselect animated bounceIn hvring"
        v-on:click="monthly=true;choice=false;"
      >
        <span>
          <div>Months</div>
        </span>
      </button>

      <button
        class="btnselect animated bounceIn hvring"
        v-on:click="byHours=true;choice=false;"
      >
        <span>
          <div>Days</div>
        </span>
      </button>
    </div>
    <transition
      mode="out-in"
      appear
      enter-active-class="animated flipInX fast"
      leave-active-class="animated flipOutX fast"
    >
      <div class="switch" key="day" v-if="byHours">
        <div class="margintop"></div>
        <br />

        <datepicker
          placeholder="Day ..."
          class="datepicker"
          :format="customFormatter"
          v-model.lazy="singleDay"
          :disabled-dates="disabledDates"
        ></datepicker>
        <div class="controller-wrapper">
          <custom-select
            v-model.lazy="singleDayValueType"
            placeholder="Value type ..."
            class="style-chooser margleft"
            :options="valueTypeArr"
          ></custom-select>
        </div>          

        <div v-if="!choice" class="room-wrapper third">
          <custom-select
            v-model.lazy="storedRoom"
            placeholder="Room ..."
            class="style-chooser margleft"
            :options="roomList"
          ></custom-select>
        </div>
        <button class="btnselect hvring" v-on:click="monthly=true;byHours=false;controll=false;">
          <span>Months</span>
        </button>
      </div>
      <div class="switch" key="month" v-if="monthly">
        <div class="margintop"></div>
        <br />
        <datepicker
          class="datepicker"
          placeholder="First date ..."
          :format="customFormatter"
          v-model.lazy="dateStart"
          :disabled-dates="disabledDates"
        ></datepicker>

        <datepicker
          class="datepicker"
          placeholder="Last date ..."
          :format="customFormatter"
          v-model.lazy="dateEnd"
          :disabled-dates="disabledDates"
        ></datepicker>

        <div class="controller-wrapper second">
          <custom-select
            v-model.lazy="selectedValueType"
            placeholder="Value type ..."
            class="style-chooser margleft"
            :options="valueTypeArr"
          ></custom-select>
        </div>
        <div v-if="!choice" class="room-wrapper third">
          <custom-select
            v-model.lazy="storedRoom"
            placeholder="Room ..."
            class="style-chooser margleft"
            :options="roomList"
          ></custom-select>
        </div>
        <button class="btnselect hvring" v-on:click="byHours=true;monthly=false;controll=false;">
          <span>Days</span>
        </button>
      </div>
    </transition>

    <Chart :styles="myStyles" v-if="!choice" ref="data_chart" :chart-data="chartData" :options="options"></Chart>
   <div v-if="!choice">
  <div class="togglers title3"> Current data <img  alt="Not Found"  src="../../assets/gauge.png" height="25">: 
  <toggle-button class="toBack" v-model="myDataVariable" :labels="{checked: 'On', unchecked: 'Off'}"/></div>
    <div class="togglers" v-if=myDataVariable>  Controller <img  alt="Not Found"  src="../../assets/microcont.png" height="25">: 
    <toggle-button class="toBack" v-model="showController" :labels="{checked: 'On', unchecked: 'Off'}"/>  
    Sensor <img  alt="Not Found"  src="../../assets/sensor.png" height="32">: 
    <toggle-button class="toBack" v-model="showSensor" :labels="{checked: 'On', unchecked: 'Off'}"/></div>
   </div>
    <transition 
    appear
    mode="in-out"
    enter-active-class="animated fadeIn faster"
    leave-active-class="animated fadeOut faster"
    >

   <div v-if="!choice && myDataVariable" class="animated fadeIn">
       <div class="title2"><b class="title">Current Data</b></div>
    <table class='comparison-table'>
        <tr v-for="(item,index) in currentData" class="animated fadeIn" :key="item.id" :style="{backgroundColor:colors[index % colors.length]}" >
          <td v-if=showCurrentData >
          <div class="newLine" v-if=showSensor> <img  alt="Not Found"  src="../../assets/sensor.png" height="32"> {{item.sensor}}</div>
          <div class="newLine" v-if=showController> <img  alt="Not Found"  src="../../assets/microcont.png" height="25"> {{item.controller}} </div>
          <div class="newLine" ><img  alt="Not Found"  src="../../assets/gauge.png" height="25"> {{item.valuetype}} - {{item.data}} {{item.dimension}}</div>
          </td>
        </tr>
    </table>
   </div>
    </transition>
    

    

 
  <Modal v-if="showModal" @close="showModal = false">
       
        <h3 slot="header">This room have no data.</h3>
      </Modal>
        <Modal v-if="showSecondModal" @close="showSecondModal = false">
       
        <h3 slot="header">No data.</h3>
      </Modal>
  </div>
</template>

<script>
import store from '../../store/store';
import Chart from "./Chart";
import Modal from "./Modal";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Datepicker from "vuejs-datepicker";
var moment = require("moment");

const options = {
maintainAspectRatio:false,
responsive:true,
tooltips: {
    mode: 'index',
    intersect: false,
   }

,
  legend: {
    onClick: e => e.stopPropagation(),
    labels: {
      fontSize: 20
    }
  },
  animation: {
    animateRotate: false
  },
  customLine: {
color: 'dodgerblue'
}
 
};


export default {
  components: {
    vSelect,
    Datepicker,
    Chart,
    Modal
  },
  
  name: "app",
  
  data() {
    return {
    dataFromPusher:store.getters.giveTrigger,
    currentData:[],
      dimVal: [],
      showModal:false,
      showSecondModal:false,
      controll:false,
      showSensor:false,
      showController:false,
      myDataVariable:false,
      hover: false,
      colors: ["#8eeb92", "white"],
      arrSingleDay: [],
      singleDayValueType: "",
      singleDay: "",
      storedRoom: "",
      dateStart: "",
      dateEnd: "",
      hoursStart: "",
      hoursEnd: "",
      monthly: false,
      byHours: false,
      choice: true,
      moment,
      valueTypeArr: [],
      selectedValueType: "",
      dataForGraph: [],
      dataLabel: [],
      dataGraph: [],
      roomList: [],
      options,
      chartData: {
        labels: [],
        datasets: [
          {
        pointBackgroundColor:"rgba(30, 143, 255, 0.281)",
            pointRadius: 0,
            backgroundColor: ["rgba(30, 143, 255, 0.281)"],
            borderColor: ["rgba(228, 6, 127, 1)"],
            borderWidth: 0,
            pointHoverRadius: 0,
            label: "",
            data: []
          }
        ]
      },

      disabledDates: {
        to: new Date(2019, 11, 25),
        from: new Date(Date.now()) 
      }
    };
  },
  computed: {
   
    myStyles(){
      return{
        height:500+'px',
         position: 'relative'
      }
    },
    currentDataSet() {
      return this.chartData.datasets[0].data;
    },
    
  },
  watch: {
    dataGraph(){
      if(this.dataGraph.length===0 && this.controll===true){
          this.showSecondModal=true;
      }
    },
    dataFromPusher(){
       this.showCurrentData()
    },
    choice(){
    this.showCurrentData()
    },
    myDataVariable(){
      console.log(this.myDataVariable)
    },
    storedRoom() {
      this.showCurrentData()
      this.dropDvalues();
      this.selectedValueType="";
      this.singleDayValueType="";
      console.log(this.valueTypeArr);
      if (this.monthly) {
        this.intervalData();
      } else {
        this.singleDayCheck();
      }
    },
    
    monthly() {
       this.dataGraph = [];
      this.dataLabel = [];
      this.selectedValueType = "";
      this.singleDayValueType = "";
      this.dateStart = "";
      this.dateEnd = "";
      this.singleDay = "";
      this.refreshChart();
    },
    singleDay() {
      this.singleDayCheck();
    },
    singleDayValueType() {
      this.singleDayCheck();
      if (this.singleDayValueType === null) {
        this.singleDayValueType = "";
      }else{
        this.controll=true
      }
    },
    dateStart() {
      this.intervalData();
    },
    dateEnd() {
      this.intervalData();
    },
    selectedValueType() {
      this.intervalData();
      if (this.selectedValueType === null) {
        this.selectedValueType = "";
        this.dataGraph = [];
        this.dataLabel = [];
        this.refreshChart();
      }else{
        this.controll=true
      }
    },
    valueTypeArr(){
      if(this.valueTypeArr.length===0){
          this.showModal=true;
          this.choice=false;
          this.monthly=true;
      }
    }
  },
  methods: {
      showCurrentData(){
        this.currentData.splice(0);
        var filtered=this.dataFromPusher.filter(m =>
        m.room.includes(this.storedRoom));
      for (let index = 0; index <  filtered.length; index++) {
          this.currentData.push({
              valuetype: "",
              dimension:"",
              controller:"",
              sensor:"",
              data:"",
              id:""
           
            });
          
        this.currentData[index].valuetype=(filtered[index].valuetype)
         this.currentData[index].dimension=(filtered[index].dimension)
        this.currentData[index].data=(filtered[index].data)
        this.currentData[index].controller=(filtered[index].controllername)
        this.currentData[index].sensor=(filtered[index].sensorname)
        this.currentData[index].id=(' - '+filtered[index].id)
      }
      },
    
    dropDvalues() {
      //andme tüübi rippmenüüsse salvestamine vastavalt ruumi
      this.$http
        .get(
          "http://localhost:3000/api/data/valuetypes/" + this.storedRoom + ""
        )
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          for (let key in data) {
            resultArray.push(data[key]);
          }
          var count = 0;
          this.valueTypeArr = [];
          for (let index = 0; index < resultArray[1].length; index++) {
            if (resultArray[1][index].valuetype === "Illuminance" &&
              count === 0) {
              this.valueTypeArr.push(resultArray[1][index].valuetype);
            } else if (resultArray[1][index].valuetype !== "Illuminance") {
              this.valueTypeArr.push(resultArray[1][index].valuetype);
            }
            if (resultArray[1][index].valuetype === "Illuminance") {
              count++;
            }
          }
        });
    },
  
    handler() {
      this.$router.go(-1);
    },
    graphDataManipulation(array, intervalForAvg) {
      var temparr = [];
      var countHours = 0;
      var countDates = 0;
      var arrForAvg = [];
      var avgData = 0;
      var tempForRestData = {};
      var tempHold = array;
      for (let index = 0; index < tempHold.length; index++) {
        if (countHours === 0) {
          temparr.push({
            date: tempHold[index].date,
            data: "",
            controllername: "",
            dimension: "",
            room: "",
            sensorname: "",
            valuetype: ""
          });
        }
        if (Math.abs(new Date(temparr[countDates].date) - new Date(tempHold[index].date))
         /36e5 >intervalForAvg) 
         {
          var total = 0;
          for (var i = 0; i < arrForAvg.length; i++) {
            total += arrForAvg[i];
          }
          var avg = total / arrForAvg.length;
          if(avg!==0){
          temparr[countDates].data = avg;
          temparr[countDates].room = tempHold[index].room;
          temparr[countDates].controllername = tempHold[index].controllername;
          temparr[countDates].dimension = tempHold[index].dimension;
          temparr[countDates].sensorname = tempHold[index].sensorname;
          temparr[countDates].valuetype = tempHold[index].valuetype;
          }
          
          arrForAvg = [];
          countHours = 0;
          countDates++;
        } else {
          arrForAvg.push(tempHold[index].data);
          countHours++;
        }
      }
      return (temparr = temparr.filter(item => item.data !== ""));
    },
    singleDayCheck() {
      if (this.singleDay !== "" && this.singleDayValueType !== "") {
        this.singleDayData();
      }
    },
    sameDay(d1, d2) {
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    },
    updateChart() {
      if (this.$refs.data_chart) {
        this.$refs.data_chart.update();
      }
    },
    refreshChart() {
      const currentDataset = this.chartData.datasets[0];

      this.chartData.labels = this.dataLabel;
      if (this.selectedValueType != "" || this.singleDayValueType != "") {
        var compare =
          this.selectedValueType.toLowerCase() +
          this.singleDayValueType.toLowerCase();
        let dim = this.dimVal.filter(
          m => m.valuetype.toLowerCase() === compare
        );
        currentDataset.label =
          this.selectedValueType +
          this.singleDayValueType +
          ", " +
          dim[0].dimension;
      } else {
        currentDataset.label = "";
      }

      currentDataset.data = this.dataGraph;
      this.updateChart();
    },
    async singleDayData() {
      try {
        await this.$http
          .get(
            "http://localhost:3000/api/data/" +
              this.storedRoom +
              "/" +
              moment(this.singleDay).format("YYYY-MM-DD") +
              "/" +
              this.singleDayValueType +
              ""
          )
          .then(response => {
            return response.json();
          })
          .then(data => {
            const resultArray = [];
            for (let key in data) {
              resultArray.push(data[key]);
            }

            this.arrSingleDay = resultArray[1];
          });
      } catch (error) {
        console.log(error);
      }

      var temp = this.graphDataManipulation(this.arrSingleDay, 0.1);

      this.dataGraph = [];
      this.dataLabel = [];
      for (let index = 0; index < temp.length; index++) {
        this.dataGraph.push(temp[index].data.toFixed(2));
        this.dataLabel.push(
          moment(temp[index].date).format("YYYY-MM-DD, HH:mm:ss")
        );
      }
      this.refreshChart();
    },
    async intervalData() {
      try {
        if (this.dateStart !== "" && this.dateEnd !== "") {
          await this.$http
            .get(
              "http://localhost:3000/api/data/room/interval/" +
                moment(this.dateStart).format("YYYY-MM-DD") +
                "/" +
                moment(this.dateEnd).format("YYYY-MM-DD") +
                ""
            )
            .then(response => {
              return response.json();
            })
            .then(data => {
              const resultArray = [];
              for (let key in data) {
                resultArray.push(data[key]);
              }
              this.dataChart = resultArray[1];
            });
        }
      } catch (error) {
        console.log(error);
      }
      if (
        this.dateStart !== "" &&
        this.dateEnd !== "" &&
        this.selectedValueType !== "" &&
        this.selectedValueType !== null
      ) {
        let filtered = this.dataChart;

        if (this.selectedValueType) {
          filtered = this.dataChart.filter(
            m =>
              m.valuetype.toLowerCase() === this.selectedValueType.toLowerCase()
          );
        }

        if (this.storedRoom) {
          filtered = filtered.filter(
            m => m.room.toLowerCase() === this.storedRoom.toLowerCase()
          );
        }

        filtered.sort(function(a, b) {
          return (
            new Date(moment(a.date).format("YYYY-MM-DD")) -
            new Date(moment(b.date).format("YYYY-MM-DD"))
          );
        });
        var temp = this.graphDataManipulation(filtered, 4); 
       
        this.dataGraph = [];
        this.dataLabel = [];
        for (let index = 0; index < temp.length; index++) {
          this.dataGraph.push(temp[index].data.toFixed(2));
          this.dataLabel.push(
            moment(temp[index].date).format("YYYY-MM-DD, HH:mm:ss")
          );
        }
        this.refreshChart();
      }
    },
    customFormatter(date) {
      return moment(date).format("MMM/DD/YY");
    }
  },

  beforeDestroy() {
    window.removeEventListener("unload", this.handler);
  },
  mounted() {
   console.log(store.getters.giveTrigger)


    window.addEventListener("unload", this.handler);
  },
  created() {
    
    this.$http
      .get("http://localhost:3000/api/dimensions/valuetypes")
      .then(response => {
        return response.json();
      })
      .then(data => {
        const resultArray = [];
        for (let key in data) {
          resultArray.push(data[key]);
        }
        this.dimVal = resultArray[1];
      });
    this.storedRoom = this.$store.getters.giveroom;
    this.roomList = this.$store.getters.giveRooms;

  }
};
</script>

<style scoped>
.heading {
  margin-top: 22px;
  margin-bottom: 17px;
  font-size: 30px;
}
.chosing {
  text-align: center;
}
.switch button {
  float: right !important;
}
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

.margleft {
  margin-left: 25px;
}
h1,
.muted {
  color: #2c3e5099;
}
.body {
  margin-right: auto;
  margin-left: auto;
  max-width: 1200px;
  padding-right: 10px;
  padding-left: 10px;
}
h1 {
  font-size: 26px;
  font-weight: 600;
}
.margn {
  margin-right: 20px;
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
.btnselect {
  display: inline-block;
}
button::-moz-focus-inner {
  border: 0;
}
button {
  background-color: rgba(30, 143, 255, 0.685);
  text-decoration: none;
  outline: 0;
  color: white;
  padding: 20px;
  text-align: center;
  border: none;
  text-decoration: none;
  display: inline-block;
  font-size: 30px;
  cursor: pointer;
  width: 200px;
  border-radius: 13px;
  transition: 0.3s;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.wrapper {
  font-size: 25px;
}
.hvring{
  background: linear-gradient(to right, #8eeb92 50%, rgba(30, 143, 255, 0.685) 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  color: white;
  font-weight: bold;
  transition: all 1.5s ease;
}
.datepicker >>> input {
  width: 145px;
  height: 50px;
  font-size: 20px;
  margin-bottom: 5px;
  display: inline-block;
  text-align: center;
  border-radius: 13px;
  border: solid;
  cursor: pointer;
  border-color: rgba(30, 143, 255, 0.685);
  background: linear-gradient(to right, #8eeb92 50%, white 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  color: black;
  font-weight: bold;
 text-decoration: none;
  transition: all 2s ease;
}
.hvring:hover{
  background-position: left bottom;
}
.datepicker >>> input:focus{
  outline: none;
  

}
.hvring:hover span{
 color: black;
 transition:1s;
}
.datepicker >>> input:hover {
  background-position: left bottom;
  color: black;
  font-weight: bold;
}

.datepicker {
  display: inline-block;
  text-decoration: none;

}

button span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 1s;
}
button span:after {
  content: "\00bb";
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 1s;
}
button:hover span {
  padding-right: 25px;
  color:#E4067F;
}

button:hover span:after {
  opacity: 1;
  right: 0;
  color:#E4067F;
}
.listStyle{
  color: black;
  font-size:22px;
}
.onLeft{
  float: left;
  width:300px;
}
.onCenter{       
  margin:0 auto;
  width:300px;
}
.onRight{
    float: right;
    width:500px;
}

.margintop {
  margin-top: 20px;
}

b{
color:black;
  font-size: 22px;
}

.title2{
  text-align: center;
  margin-bottom: 10px;
  padding-top: 10px;
}
.title3{
  padding-top: 50px;
}
.title{
 color:black;
 text-align: center;
 font-size: 35px;
 
  
}
.fade-enter-active, .fade-leave-active {
  transition: all .2s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
.fade-enter-active {
  transition-delay: .2s;
}
.working{
  position: relative;
  height:300px;
  width:100%;
}
.togglers{
  display: inline-block;
  font-size: 30px;
}


table {
 border: 1px solid grey;
 border-collapse: collapse;
 margin: 0 auto;
}



td {
 border: 1px solid grey;
 padding: 10px;
 display: block;
 text-align: center;
}
.newLine{
  display: block;
  font-size: 30px;
}


</style>