const initialState = {
    user: ''
}


const AuthenReducer=(state = initialState, action)=>{
    if(action.type === "LOGIN"){
        console.log(action.payload)
        return{
            user: action.payload
        }
    }else if(action.type === "LOGOUT"){
        return{
            user: ''
        }
    }else{
        return state
    }
}


export default AuthenReducer