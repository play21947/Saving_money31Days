import axios from "axios"

export const LoginUpdateState=(user)=>{
    return ((dispatch)=>{
        axios.post('http://play2api.ddns.net:3001/login',{
            user: user
        }).then((res)=>{
            console.log("ACTION : ", res.data)
            if(res.data.user_data){
                dispatch({
                    type: 'LOGIN',
                    payload: res.data.user_data
                })
            }
        })
    })
}


export const LogoutUpdateState=()=>{
    return{
        type: 'LOGOUT'
    }
}