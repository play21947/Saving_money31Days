import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, { useState } from 'react'
import {View, Text, TextInput, Button, Alert, TouchableOpacity} from 'react-native'
import { useDispatch } from 'react-redux'
import {LoginUpdateState} from './actions/AuthenActions'

const WelcomeScreen=()=>{

    let [user, setUser] = useState('')

    let dispatch = useDispatch()


    const Submit=()=>{
        axios.post('http://play2api.ddns.net:3001/addUser', {
            user: user
        }).then((res)=>{
            if(res.data.success){
                Alert.alert("Successfully")
                dispatch(LoginUpdateState(user))
            }
        })
    }

    const Login=()=>{
        axios.post('http://play2api.ddns.net:3001/login',{
            user: user
        }).then((res)=>{
            if(res.data.user_data){
                AsyncStorage.setItem('name', res.data.user_data[0].name)
                dispatch(LoginUpdateState(user))
            }
        })
    }

    return(
        <View style={{padding: 10, justifyContent: 'center', flex: 1}}>
            <Text style={{fontFamily: 'Prompt-Regular', color: '#1a1a1a', fontSize: 22}}>มาเริ่มออมเงินด้วยกันเถอะ!</Text>
            <Text style={{fontFamily: 'Prompt-Regular', color: 'gray', fontSize: 16, marginBottom: 10}}>เปิดบัญชีก่อนถึงจะฝากได้นะ</Text>
            <Text style={{fontFamily: 'Prompt-Regular', fontSize: 18, color: '#1a1a1a'}}>บัญชีผู้ใช้</Text>
            <TextInput style={{ borderRadius: 8, backgroundColor: 'white', elevation: 5, fontFamily: 'Prompt-Regular'}} onChangeText={(text)=>{
                setUser(text)
            }}></TextInput>
            <TouchableOpacity style={{width: '100%', height: 40, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center', marginTop: 10, borderRadius: 6}} onPress={()=>{
                Login()
            }}>
                <Text style={{fontFamily: 'Prompt-Regular', fontSize: 18, color: 'white'}}>เข้าสู่ระบบ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '100%', height: 40, backgroundColor: 'orange', alignItems: 'center', justifyContent: 'center', marginTop: 10, borderRadius: 6}} onPress={()=>{
                Submit()
            }}>
                <Text style={{fontFamily: 'Prompt-Regular', fontSize: 18, color: '#1a1a1a'}}>สมัครสมาชิก</Text>
            </TouchableOpacity>
        </View>
    )
}

export default WelcomeScreen