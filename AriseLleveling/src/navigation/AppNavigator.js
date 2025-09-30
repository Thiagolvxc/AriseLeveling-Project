import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {Ionicons} from '@expo/vector-icons'
import colors from '../constants/colors'

import HomeScreen from '../screens/HomeScreen'
import SplashScreen from '../screens/SplashScreen'
import UserScreen from '../screens/UserScreen'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return(
        <Tab.Navigator initialRouteName='Home' screenOptions={({route}) => ({
            tabBarIcon: ({color, size}) =>{
                let iconName;
                if(route.name === 'Home'){
                    iconName = 'home-outline'
                } else if (route.name === 'User'){
                    iconName = 'person-outline'
                }
                return <Ionicons name={iconName} size={size} color={color}/>
            },
            tabBarActiveTintColor: colors.variante7,
            tabBarInactiveTintColor: colors.thin,
            tabBarStyle: {background: colors.luminous}
        })}>
            <Tab.Screen name = 'Home' component={HomeScreen} options={{}}/>
            <Tab.Screen name = 'User' component={UserScreen} options={{}}/>
        </Tab.Navigator>
    )
}

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='Splash'>
            <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="User" component={UserScreen}/>
            <Stack.Screen name="MainTabs" component={TabNavigator} options={{headerShown: false}}/>
        </Stack.Navigator>
    )        
}

export default AppNavigator