import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from './WelcomeScreen'
import { applyMiddleware, createStore } from 'redux'
import { Provider, useSelector } from 'react-redux'
import AllReducers from './AllReducers'
import Main from './Main'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import thunk from 'redux-thunk'
import {useDispatch} from 'react-redux'
import { LoginUpdateState } from './actions/AuthenActions'

let Stack = createNativeStackNavigator()


const store = createStore(AllReducers, applyMiddleware(thunk))


const Warp = () => {

  let dispatch = useDispatch()

  let user = useSelector((state)=>{
    return state.authen.user
  })

  // console.log(user)

  useEffect(()=>{
    AsyncStorage.getItem("name").then((user)=>{
      console.log(user)
      axios.post('http://play2api.ddns.net:3001/get_detail',{
        user: user
      }).then((res)=>{
        dispatch(LoginUpdateState(user))
      })
    })
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user && user.length > 0 ? <Stack.Screen name="MAIN" component={Main} options={{headerShown: false}}></Stack.Screen> : <Stack.Screen name='WELCOME_SCREEN' component={WelcomeScreen} options={{headerShown: false}}></Stack.Screen>}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <Warp />
    </Provider>
  )
}

export default App