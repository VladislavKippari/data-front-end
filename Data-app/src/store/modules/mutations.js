  const state={
    room:'',
    rooms:[]
}
 const mutations={
    selectedRoom:(state,payload)=>{
        state.room=payload;
    },
    roomsFill:(state,payload)=>{
        state.rooms=payload;
    }
}
const getters={
    giveroom:state=>{
        return state.room;
    },
    giveRooms:state=>{
        return state.rooms;
    }
}
export default{
    state,
    mutations,
    getters
}