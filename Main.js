import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Alert, Button, Image, ScrollView } from "react-native"
import { useDispatch, useSelector } from 'react-redux'
import { LogoutUpdateState } from './actions/AuthenActions'
import { Animated } from 'react-native'
import Sound from 'react-native-sound'

const Main = () => {

    let sound = new Sound('two.mp3')

    let test = useState(new Animated.Value(0))[0]
    let handle = useState(new Animated.Value(0))[0]

    let dispatch = useDispatch()

    let user = useSelector((state) => {
        return state.authen.user
    })

    let [result, setResult] = useState([])

    let [sum, setSum] = useState(0)

    let [temp, setTemp] = useState([])

    // console.log(result)

    let [holder, setHolder] = useState(0)

    let [time, setTime] = useState(3)
    let [status, setStatus] = useState(false)

    let [user_detail, setUser_detail] = useState([])

    let [show, setShow] = useState(false)

    let Deposit = () => {
        axios.post('http://play2api.ddns.net:3001/deposit', {
            user: user[0].name,
            all_day: temp
        }).then((res) => {
            if (res.data.success) {
                setStatus(true)
                setHolder(holder + 1)
                Alert.alert("success")
                setShow(false)
                setTemp([])
                setSum(0)
                setTimeout(() => {
                    setStatus(false)
                }, 3000)
            }
        })
    }

    const FadeIn = () => {
        Animated.timing(handle, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false
        }).start()
    }

    const FadeOut = () => {
        Animated.timing(handle, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false
        }).start()
    }


    const GetApi = () => {
        return new Promise((resolve, reject) => {
            axios.post('http://play2api.ddns.net:3001/get_detail', {
                user: user[0].name
            }).then((res) => {
                resolve(setResult(Object.values(res.data[0]).slice(2, 33)))
            })
        })
    }


    const GetApiSec = () => {
        return new Promise((resolve, reject) => {
            axios.post('http://play2api.ddns.net:3001/get_detail', {
                user: user[0].name
            }).then((res) => {
                resolve(setUser_detail(res.data))
            })
        })
    }

    const Run = async () => {
        await GetApi()
        await GetApiSec()
    }

    const GetDateDeposit = () => {


        let monthly = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        let Today = new Date().getDate()
        let ThisMonth = new Date().getMonth()
        let ThisYear = new Date().getFullYear()

        let CountThisMonth = new Date(ThisYear, ThisMonth + 1, 0).getDate()

        let StartThisMonth = new Date(ThisYear, ThisMonth, Today).toDateString()
        let EndNextMonth = new Date(ThisYear, ThisMonth, Today + 31).toDateString()

        // console.log("Start Deposit : ", Today, ThisMonth+1, ThisYear, CountThisMonth)

        console.log(EndNextMonth.split(' ')[3])

        // console.log("Start Real : ", monthly.indexOf(StartThisMonth.split(' ')[1])+1)
        // console.log("End : ",EndNextMonth.split(' ')[2], monthly.indexOf(EndNextMonth.split(' ')[1])+1, EndNextMonth.split(' ')[3])

        let StartDepositObject = {
            day: StartThisMonth.split(' ')[2],
            month: monthly.indexOf(StartThisMonth.split(' ')[1]) + 1,
            year: StartThisMonth.split(' ')[3]
        }

        let EndNextMontObject = {
            day: EndNextMonth.split(' ')[2],
            month: monthly.indexOf(EndNextMonth.split(' ')[1]) + 1,
            year: EndNextMonth.split(' ')[3]
        }

        // console.log(StartDeposit)
        // console.log(EndNextMontObject)


        axios.post('http://play2api.ddns.net:3001/get_date', {
            start_date: StartDepositObject,
            end_date: EndNextMontObject,
            user: user_detail[0].name
        }).then((res) => {
            if (res.data.success) {
                Alert.alert("เสร็จสิ้น")
            }
        })
    }


    useEffect(() => {

        Run()

        Animated.timing(test, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
        }).start()
    }, [holder])

    return (
        <Animated.View style={[{ opacity: test, padding: 10, flex: 1 }]}>



            {user_detail && user_detail.length > 0 ? user_detail[0].start_date && user_detail[0].end_date ? null : <View style={{ width: '90%', height: '50%', backgroundColor: 'white', padding: 10, position: 'absolute', zIndex: 1, alignSelf: 'center', top: '25%', elevation: 5, borderRadius: 8 }}>
                <Text style={{ fontFamily: 'Prompt-Medium', fontSize: 22, color: '#1a1a1a' }}>ยินดีต้อนรับสำหรับการฝากเงิน</Text>
                <Text style={{ fontFamily: 'Prompt-Regular', fontSize: 16, color: 'gray' }}>เราจะช่วยให้การออมเงินของคุณสะดวกง่ายดายเเล้วเข้าใจง่าย</Text>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderBottomWidth: 1, padding: 20, borderColor: 'gray', marginTop: 60 }} onPress={() => {
                    GetDateDeposit()
                    setHolder(holder + 1)
                }}><Text style={{ fontFamily: 'Prompt-Regular', color: "skyblue", fontSize: 22 }}>เริ่มฝากเงิน</Text></TouchableOpacity>
            </View> : null}


            <ScrollView>
                {user_detail && user_detail.length > 0 ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10}}>
                    <Text style={{ fontFamily: 'Prompt-Regular', color: '#1a1a1a', fontSize: 24 }}>บัญชี : {user_detail[0].name}</Text>
                </View> : null}

                {user_detail && user_detail.length > 0 ? user_detail[0].start_date && user_detail[0].end_date ? user_detail.map((item, index) => {
                    let start_cvt = JSON.parse(item.start_date)
                    let end_cvt = JSON.parse(item.end_date)

                    let today_date = new Date().getDate()
                    let today_month = new Date().getMonth()
                    let today_year = new Date().getFullYear()

                    let date1 = new Date(start_cvt.year, start_cvt.month, start_cvt.day)
                    let date2 = new Date(today_year, today_month + 1, today_date)
                    let diffTime = date1 - date2
                    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    return (
                        <View key={index}>
                            <View style={{ backgroundColor: 'white', padding: 10, elevation: 5, borderRadius: 8, marginBottom: 10 }}>
                                <Text style={{ fontFamily: 'Prompt-Regular', color: '#1a1a1a' }}>START : {start_cvt.day}/{start_cvt.month}/{start_cvt.year}</Text>
                                <Text style={{ fontFamily: 'Prompt-Regular', color: '#1a1a1a' }}>END : {end_cvt.day}/{end_cvt.month}/{end_cvt.year}</Text>
                            </View>
                            {diffDays < 0 ? <Text style={{ fontFamily: 'Prompt-Regular', fontSize: 18, color: 'firebrick' }}>สถานะ : {diffDays + user_detail[0].deposit_count} วัน</Text> : <Text style={{ fontFamily: 'Prompt-Regular', fontSize: 18, color: 'green' }}>สถานะ : +{diffDays + user_detail[0].deposit_count} วัน</Text>}
                        </View>
                    )
                }) : null : null}

                {user_detail && user_detail.length > 0 ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Prompt-Regular', fontSize: 16, color: '#1a1a1a' }}>เงินรวม :</Text>
                    <Text style={{ fontFamily: 'Prompt-Regular', marginLeft: 10, fontSize: 18, color: 'green' }}>{user_detail[0].total}฿</Text>
                </View> : null}





                {status ? <Animated.View style={{ width: '100%', backgroundColor: 'white', elevation: 5, height: '50%', position: 'absolute', zIndex: 1, alignSelf: 'center', top: '25%' }}>
                    <Image style={{ width: '100%', height: '100%' }} source={require('./vector/giphy.gif')}></Image>
                </Animated.View> : null}

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}>
                    {result && result.length > 0 ? result.map((item, index) => {
                        return (
                            <View key={index} style={{ width: '20%', height: 70, padding: 5 }}>
                                {temp.includes(item) ? <TouchableOpacity style={{ backgroundColor: 'gray', width: '100%', height: '100%', padding: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }} disabled><Text style={{ fontFamily: 'Prompt-Regular', color: 'white' }}>เลือกแล้ว</Text></TouchableOpacity> : <TouchableOpacity onPress={() => {
                                    // Deposit(item)
                                    setShow(true)
                                    setSum(sum + Number(item))
                                    setTemp([...temp, Number(item)])
                                    FadeIn()
                                }} style={{ backgroundColor: item == 0 ? 'gray' : 'green', width: '100%', height: '100%', padding: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'Prompt-Regular' }}>{item}</Text>
                                </TouchableOpacity>}
                            </View>
                        )
                    }) : null}

                </View>

                <TouchableOpacity style={{position: 'absolute', top: 0, right: 20}} title='singout' onPress={() => {

                    Alert.alert("ต้องการออกจากระบบ?", '', [{text: 'ออกจากระบบ', onPress:()=>{
                        AsyncStorage.removeItem('name')
                        dispatch(LogoutUpdateState())
                    }}, {text: 'ยกเลิก', onPress:()=>{
                        console.log("cancel")
                    }}])
                }}><Image source={require('./vector/logout.png')} style={{width: 30, height: 30}}></Image></TouchableOpacity>
            </ScrollView>


            {show ? <Animated.View style={[{ width: '100%', backgroundColor: 'white', elevation: 5, height: 160, alignSelf: 'center', padding: 10, zIndex: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, opacity: handle }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#1a1a1a', fontFamily: 'Prompt-Regular', fontSize: 22 }}>เงินที่ต้องการจะฝาก : {sum}฿</Text>
                    <TouchableOpacity onPress={() => {
                        setShow(false)
                        setSum(0)
                        setTemp([])
                        FadeOut()
                    }}><Image style={{ width: 15, height: 15 }} source={require('./vector/temp.png')}></Image></TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' }}>
                    {temp && temp.length > 0 ? temp.map((item, index) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                let result = temp.filter((items) => {
                                    return items != item
                                })
                                setSum(sum - item)
                                setTemp(result)
                                // setTemp(result)
                            }} key={index} style={{ marginLeft: 10 }}>
                                <Text style={{ color: '#1a1a1a', fontFamily: 'Prompt-Regular' }}>{item}</Text>
                            </TouchableOpacity>
                        )
                    }) : null}
                </View>
                <TouchableOpacity onPress={() => {
                    Alert.alert("ต้องการฝากเงิน?", '', [{text: 'ยืนยัน', onPress:()=>{
                        Deposit()
                        sound.play()
                    }}, {text: 'ยกเลิก', onPress:()=>{
                        console.log("cancel")
                    }}])
                }} style={{ width: '80%', backgroundColor: 'green', padding: 8, borderRadius: 6, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}><Text style={{ fontFamily: 'Prompt-Regular', color: 'white', fontSize: 18 }}>ฝากเงิน</Text></TouchableOpacity>
            </Animated.View> : null}
        </Animated.View>
    )
}

export default Main