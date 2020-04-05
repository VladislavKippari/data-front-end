  const state={
    room:'',
    rooms:[],
    fromTrigger:[]
}
 const mutations={
    selectedRoom:(state,payload)=>{
        state.room=payload;
    },
    roomsFill:(state,payload)=>{
        state.rooms=payload;
    },
    triggerFill:(state,payload)=>{
        
        state.fromTrigger.push(payload);
    },
    triggerTest:(state,payload)=>{
        
        state.fromTrigger=[];
    },
    triggerClear:(state)=>{
        
        state.fromTrigger.splice(0);
    },
    triggerSplice:(state)=>{
        
        state.fromTrigger.splice(-1,1);
    }
}
const getters={
    giveroom:state=>{
        return state.room;
    },
    giveRooms:state=>{
        return state.rooms;
    },
    giveTrigger:state=>{
        return state.fromTrigger;
    },
}
export default{
    state,
    mutations,
    getters
}