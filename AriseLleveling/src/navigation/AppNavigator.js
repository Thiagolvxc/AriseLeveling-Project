import React from 'react'

import HomeScreen from '../screens/HomeScreen'
import SplashScreen from '../screens/SplashScreen'

const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash'>
            <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={HomeScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
)

export default AppNavigator