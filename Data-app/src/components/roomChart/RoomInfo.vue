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
        <button class="btnselect hvring" v-on:click="monthly=true;byHours=false;">
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
        <button class="btnselect hvring" v-on:click="byHours=true;monthly=false;">
          <span>Days</span>
        </button>
      </div>
    </transition>

    <Chart v-if="!choice" ref="skills_chart" :chart-data="chartData" :options="options"></Chart>
  </div>
</template>

<script>
import Chart from "./Chart";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Datepicker from "vuejs-datepicker";
var moment = require("moment");
const options = {
  responsive: true,
  maintainAspectRatio: false,

  legend: {
    onClick: e => e.stopPropagation(),
    labels: {
      fontSize: 20
    }
  },
  animation: {
    animateRotate: false
  }
};
export default {
  components: {
    vSelect,
    Datepicker,
    Chart
  },
  name: "app",
  data() {
    return {
     
      dimVal: [],
      hover: false,
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
            pointBorderColor: "#6ccf71",
            pointBackgroundColor: "#6ccf71",
            pointHoverBackgroundColor: "#6ccf71",
            pointHoverBorderColor: "#6ccf71",
            pointBorderWidth: 7,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
            backgroundColor: ["rgba(30, 143, 255, 0.281)"],
            borderColor: ["rgba(228, 6, 127, 1)"],
            borderWidth: 1,
            label: "",
            data: []
          }
        ]
      },

      disabledDates: {
        to: new Date(2019, 11, 25), // Disable all dates up to specific date
        from: new Date(Date.now()) // Disable all dates after specific date
      }
    };
  },
  computed: {
    currentDataSet() {
      return this.chartData.datasets[0].data;
    }
  },
  watch: {
    storedRoom() {
      this.dropDvalues();
      console.log(this.valueTypeArr);
      if (this.monthly) {
        this.intervalData();
      } else {
        this.singleDayCheck();
      }
    },
    monthly() {
      //tuhista elementid sisestamiseks
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
      }
    }
  },
  methods: {
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
            if (
              resultArray[1][index].valuetype === "Illuminance" &&
              count === 0
            ) {
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
    //keskmise väärtuse loendamine määratud massiivis ARRAY iga minut või tund sõltuvalt INTERVALFORAVG
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
          tempForRestData = {};
          tempForRestData = {
            controllername: tempHold[index].controllername,
            dimension: tempHold[index].dimension,
            room: tempHold[index].room,
            sensorname: tempHold[index].sensorname,
            valuetype: tempHold[index].valuetype,
            data: tempHold[index].data
          };

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

        if (
          Math.abs(
            new Date(temparr[countDates].date) - new Date(tempHold[index].date)
          ) /
            36e5 >
          intervalForAvg
        ) {
          var total = 0;
          for (var i = 0; i < arrForAvg.length; i++) {
            total += arrForAvg[i];
          }
          var avg = total / arrForAvg.length;
          temparr[countDates].data = avg;
          temparr[countDates].room = tempForRestData.room;
          temparr[countDates].controllername = tempForRestData.controllername;
          temparr[countDates].dimension = tempForRestData.dimension;
          temparr[countDates].sensorname = tempForRestData.sensorname;
          temparr[countDates].valuetype = tempForRestData.valuetype;

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
      if (this.$refs.skills_chart) {
        this.$refs.skills_chart.update();
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
              console.log("this.dataChart");
              console.log(this.dataChart);
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
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return (
            new Date(moment(a.date).format("YYYY-MM-DD")) -
            new Date(moment(b.date).format("YYYY-MM-DD"))
          );
        });
        var temp = this.graphDataManipulation(filtered, 4); //keskmised andmed ühe päeva jaoks
        temp.sort(function(a, b) {
          return (
            new Date(moment(a.date).format("YYYY-MM-DD")) -
            new Date(moment(b.date).format("YYYY-MM-DD"))
          );
        });

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


.margintop {
  margin-top: 20px;
}
</style>