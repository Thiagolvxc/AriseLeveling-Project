import React, {useState, useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {Ionicons} from '@expo/vector-icons'
import {auth} from '../services/firebaseConfig'
import {onAuthStateChanged} from 'firebase/auth'
import {useContext, createContext} from 'react'
import colors from '../constants/colors'
import HomeScreen from '../screens/HomeScreen'
import SplashScreen from '../screens/SplashScreen'
import UserScreen from '../screens/UserScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const TabNavigator = () => {
    const {user} = useAuth();

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
            tabBarStyle: {backgroundColor: colors.luminous}
        })}>
            <Tab.Screen name = 'Home' component={HomeScreen} options={{}}/>
            <Tab.Screen name = 'User' component={UserScreen} options={{}}/>
        </Tab.Navigator>
    )
}

const AppNavigator = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const authContextValue = {
        user,
        setUser,
        isLoading,
        setIsLoading
    };

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            <Stack.Navigator initialRouteName={user ? "Main" : "Splash"}>
                <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Main" component={TabNavigator} options={{headerShown: false}}/>
            </Stack.Navigator>
        </AuthContext.Provider>
    )        
}

export default AppNavigator