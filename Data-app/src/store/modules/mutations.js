  const state={
    room:''
}
 const mutations={
    selectedRoom:(state,payload)=>{
        state.room=payload;
    }
}
const getters={
    giveroom:state=>{
        return state.room;
    }
}
export default{
    state,
    mutations,
    getters
}