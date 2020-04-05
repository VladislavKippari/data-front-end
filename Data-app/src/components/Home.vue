<template >
         
  <div>
   
    <div class="searchBar">
      <div class="room-wrapper third animated slideInLeft">
        <custom-select
          v-model="roomSearch"
          placeholder="Room ..."
          class="style-chooser"
          :options="roomList"
        ></custom-select>
      </div>
      <div class="sensor-wrapper animated fadeIn">
        <custom-select
          v-model="sensorSearch"
          placeholder="Sensor ..."
          class="style-chooser"
          :options="sensorList"
        ></custom-select>
      </div>
      <div class="controller-wrapper second animated slideInRight">
        <custom-select
          v-model="controllerSearch"
          placeholder="Controller ..."
          class="style-chooser"
          :options="controllerList"
        ></custom-select>
      </div>
    </div>

    <Container v-slot="{ gridClass }">
      <div :class="gridClass">
      
        <Item

          v-for="(room, i) in filterRooms"
          :key="`room-${i}`"
          :room="room.room"
          
          :valuetype1="room.valuetype.find(item => item === valuetypeOtp1)"
          :valuetype2="room.valuetype.find(item => item=== valuetypeOtp2)"
          :valuetype3="room.valuetype.find(item => item === valuetypeOtp3)"
         :value1="pusherArray.find(x => x.valuetype === valuetypeOtp1 && x.room===room.room) ? pusherArray.find(x => x.valuetype === valuetypeOtp1 && x.room===room.room).data:''"
        :value2="pusherArray.find(x => x.valuetype === valuetypeOtp2 && x.room===room.room) ? pusherArray.find(x => x.valuetype === valuetypeOtp2 && x.room===room.room).data:''"
         :value3="pusherArray.find(x => x.valuetype === valuetypeOtp3 && x.room===room.room) ? pusherArray.find(x => x.valuetype === valuetypeOtp3 && x.room===room.room).data:''"
          :dimension1="room.dimension.find(item => item === dimensionOtp1)"
          :dimension2="room.dimension.find(item => item === dimensionOtp2)"
          :dimension3="room.dimension.find(item => item === dimensionOtp3)"
        ></Item>
      </div>
    </Container>

  </div>
</template>

<script>

import store from '../store/store';
import Container from "./transitionHomeTiles/Container";
import Item from "./transitionHomeTiles/Item";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  components: {
    Container, //ruumide kuvamiseks koht
    Item, //komponent ühe tuppa kuvamiseks
    vSelect //rippmenüü
  },
  data() {
    return {
      hover: false,
      pusherArray:store.getters.giveTrigger,
      valuetypeOtp1:'T',
      valuetypeOtp2:'Humidity',       
      valuetypeOtp3:'Illuminance',    //keskmised andmete kuvamiseks
      dimensionOtp1:'C',
      dimensionOtp2:'%',
      dimensionOtp3:'LUX',
      roomSearch: "", //valitud tuppa rippmenuust
      sensorSearch: "", //valitud sensor rippmenuust
      controllerSearch: "", //valitud kontroller rippmenuust
      rooms: [], //massiiv filteriimise jaoks
      controllerSensor: [], //massiiv andmebaasi andmete hoidmiseks
      controllerList: [], //kontrolllerid loend rippmenuu
      sensorList: [], //sensorid loend rippmenuu
      roomList: [], //tuppa loend rippmenuu
      avgDataList: []
    };
  },
  methods: {
     
    
    hoverMouse() {
      this.hover = true;
    },
    leaveMouse() {
      this.hover = false;
    },
    //meetod tähtede eemaldamiseks ruumi numbritest
    compare(a, b) {
      if (
        parseInt(a.room.replace(/\D/g, "")) <
        parseInt(b.room.replace(/\D/g, ""))
      ) {
        return -1;
      }
      if (
        parseInt(a.room.replace(/\D/g, "")) >
        parseInt(b.room.replace(/\D/g, ""))
      ) {
        return 1;
      }
      return 0;
    }
  },
  created() {
    //keskmise andmete paigaldamine
    var intervalType='hours';  //years,months,hours //https://www.postgresqltutorial.com/postgresql-interval/
    var intervalTime='1';
    this.$http
      .get('http://localhost:3000/api/avaragedata/rooms/interval/'+intervalType +'/' + intervalTime +'')
      .then(response => {
        return response.json();
      })
      .then(data => {
        const resultArray = [];
        for (let key in data) {
          resultArray.push(data[key]);
        }
        
        this.avgDataList = resultArray[1];
      });
    //rippmenüü täitmine
    this.$http
      .get("http://localhost:3000/api/rooms")
      .then(response => {
        return response.json();
      })
      .then(data => {
        //andmete salvestamine andmebaasist
        const resultArray = [];
        for (let key in data) {
          resultArray.push(data[key]);
        }
        //rippmenuu ruumid taitmine
        var object = resultArray[1];
        for (var property in object) {
          if (object[property].room != null) {
            this.roomList.push(object[property].room);
          }
        }
        //ruumide loendi sorteerimine (kasv)
        var collator = new Intl.Collator(undefined, {
          numeric: true,
          sensitivity: "base"
        });
        this.roomList.sort(collator.compare);
      });
      this.$store.commit('roomsFill',this.roomList);
    //massiivi täitmine andmetega igale ruumile
    this.$http
      .get("http://localhost:3000/api/controller/sensor/room")
      .then(response => {
        return response.json();
      })
      .then(data => {
        const resultArray = [];
        for (let key in data) {
          resultArray.push(data[key]);
        }
       
        var object = resultArray[1];
        var temp = [];
        var countrooms = 0;

        //massiivi täitmine
        for (let i = 0; i < object.length; i++) {
          var temproom = "";
          if (temp.includes(object[i].room) === false) {
            //kontroll, selleks et sama adnmed ei lähe massiivi

            this.controllerSensor.push({
              //omadused  andmete paigaldamiseks
              room: "",
              sensors: [],
              controllers: []
            });

            this.controllerSensor[countrooms].room = object[i].room;

            for (let a = 0; a < object.length; a++) {
              //sama ruumi otsimine selleks, et leida kõik võimalikud kontrollerid ja sensorid ruumist

              if (object[i].room === object[a].room) {
                if (this.controllerSensor[countrooms].sensors.includes(object[a].sensorname) === false) {
                  //dublikaatide kontroll
                  this.controllerSensor[countrooms].sensors.push(
                    object[a].sensorname
                  );
                }
                if (this.controllerSensor[countrooms].controllers.includes(object[a].controllername) === false) {
                  //dublikaatide kontroll
                  this.controllerSensor[countrooms].controllers.push(
                    object[a].controllername
                  );
                }
              }
            }
            countrooms++;
            temp.push(object[i].room);
          }
        }
        for (var property in object) {
          if (object[property].room != null) {
            //rippmenuu taitmine
            this.controllerList.push(object[property].controllername);
            this.sensorList.push(object[property].sensorname);
          }
        }

        this.controllerList = [...new Set(this.controllerList)]; //dublicatide eemaldamine
        this.sensorList = [...new Set(this.sensorList)]; //dublicatide eemaldamine
        this.sensorList.sort();
        this.controllerList.sort();
      });
  },
  computed: {
   
    //filtri realiseerimine sorteerimiseks
    
    filterRooms() {
    

      //andmed loendisse on lisatud uued omadused avarage,dimension,valuetype
      for (let i = 0; i < this.controllerSensor.length; i++) {
        this.controllerSensor[i].dimension = []; //uue omaduse initsialiseerimine
        this.controllerSensor[i].valuetype = []; //uue omaduse initsialiseerimine
        this.controllerSensor[i].avg = []; //uue omaduse initsialiseerimine
        //uute andmete (keskmine arv) lisamine massiivisse
        for (let a = 0; a < this.avgDataList.length; a++) {
          if (this.controllerSensor[i].room === this.avgDataList[a].room) {
            this.controllerSensor[i].dimension.push(
              this.avgDataList[a].dimension
            );
            this.controllerSensor[i].valuetype.push(
              this.avgDataList[a].valuetype
            );
            this.controllerSensor[i].avg.push(
              this.avgDataList[a].avg.toFixed(2)
            ); //ümardamine

          }

        }
      }
      
      
      //massiivi filtreerimine
      let filtered = this.controllerSensor;
      if (this.roomSearch) {
        filtered = this.controllerSensor.filter(
          m => m.room.toLowerCase().indexOf(this.roomSearch) > -1
        );
      }
      if (this.controllerSearch) {
        filtered = filtered.filter(m =>
          m.controllers.includes(this.controllerSearch)
        );
      }
      if (this.sensorSearch) {
        filtered = filtered.filter(m => m.sensors.includes(this.sensorSearch));
      }

      filtered.sort(this.compare);

      return filtered;
    }
  }
};
</script>
<style>
.searchBar{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  z-index: 1000 !important;
  position: relative;
  margin-bottom: 5px;

}
.sensor-wrapper {
  margin-top: 25px;
  max-height: 5px;
  min-width: 250px;
  max-width: 500px;
  display: inline-block;
  margin-right: auto;
  margin-left: auto;
  z-index: 100 !important;
  margin-bottom: 12px;


}
.controller-wrapper {
  margin-top: 25px;
  max-height: 5px;
  margin-right: auto;
  margin-left: auto;
  min-width: 200px;
  max-width: 500px;
  display: inline-block;
  z-index: 99 !important;
  margin-bottom: 12px;

}
.room-wrapper {

  margin-top: 25px;
  max-height: 5px;
  margin-right: auto;
  margin-left: auto;
  min-width: 200px;
  max-width: 600px;
  display: inline-block;
  z-index: 1001 !important;
  margin-bottom: 12px;

}




i {
  margin-left: 10px;
}
/* drop down style */
.style-chooser .vs__search::placeholder,
.style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
  background: #8eeb92;
  border: none;
  color: #394066;
  text-transform: lowercase;
  font-variant: small-caps;
  font-family: Raleway;
  font-weight: 900;
  max-height: 150px;
  font-size: 18px;
  
}

.style-chooser .vs__clear,
.style-chooser .vs__open-indicator {
  fill: #394066;
}
</style>