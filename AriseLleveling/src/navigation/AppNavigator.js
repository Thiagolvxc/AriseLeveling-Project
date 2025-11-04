/**
 * @file AppNavigator.js
 * @description Archivo principal de configuración de la navegación de la aplicación. 
 * Define las rutas, pestañas (TabNavigator) y el flujo principal (AppNavigator) según el estado de autenticación del usuario.
 */

import React, {useState, useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {Ionicons} from '@expo/vector-icons'
import {auth} from '../services/firebaseConfig'
import {onAuthStateChanged} from 'firebase/auth'
import { AuthContext, useAuth } from "../context/AuthContext";
import {Image} from 'react-native';
import colors from '../constants/colors'
import HomeScreen from '../screens/HomeScreen'
import SplashScreen from '../screens/SplashScreen'
import UserScreen from '../screens/UserScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'

/**
 * @constant
 * @description Stack principal de la aplicación (flujo principal).
 */
const Stack = createStackNavigator();

/**
 * @constant
 * @description Navegador de pestañas inferior (Tab Navigator).
 */
const Tab = createBottomTabNavigator();

/**
 * @constant
 * @description Stack específico para las pantallas del perfil.
 */
const ProfileStack = createNativeStackNavigator();

const TabNavigator = () => {

    /**
     * @constant
     * @type {{ user: Object }}
     * @description Usuario autenticado obtenido desde el contexto de autenticación.
     */
    const {user} = useAuth();

    return(
        <Tab.Navigator initialRouteName='Home' screenOptions={({route}) => ({

            /**
            * @function tabBarIcon
            * @description Renderiza el ícono correspondiente a cada pestaña.
            * Si el usuario tiene una foto de perfil (`photoURL`), se muestra en la pestaña "User".
            * @param {Object} props - Propiedades proporcionadas por el Tab Navigator.
            * @param {string} props.color - Color actual del ícono.
            * @param {number} props.size - Tamaño actual del ícono.
            * @param {boolean} props.focused - Indica si la pestaña está activa.
            * @returns {JSX.Element} Ícono o imagen de perfil.
            */
            tabBarIcon: ({color, size, focused}) =>{
                let iconName;
                if(route.name === 'Home'){
                    iconName = 'home-outline'
                } else if (route.name === 'User'){
                    if (user?.photoURL) {
                        return (
                            <Image source={{ uri: user.photoURL }} style={{
                                width: size,
                                height: size,
                                borderRadius: size / 2,
                                borderWidth: focused ? 2 : 0,
                                borderColor: focused ? '#0077B6' : 'transparent',
                            }}/>
                        );
                    }
                    return <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
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

/**
 * @component AppNavigator
 * @description Componente principal que controla la navegación general de la aplicación.
 * Determina si se muestra el flujo de autenticación o el flujo principal según el estado del usuario.
 * @returns {JSX.Element} Árbol de navegación principal envuelto en el contexto de autenticación.
 */
const AppNavigator = () => {

    /**
     * @state
     * @type {[Object|null, Function]}
     * @description Estado que almacena la información del usuario autenticado.
     */
    const [user, setUser] = useState(null);

    /**
     * @state
     * @type {[boolean, Function]}
     * @description Estado que indica si la aplicación está verificando el estado de autenticación.
     */
    const [isLoading, setIsLoading] = useState(true);

    /**
     * @effect
     * @description Suscripción al estado de autenticación de Firebase.
     * Cuando cambia el usuario, se actualiza el estado global de autenticación.
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    /**
     * @constant
     * @type {{user: Object|null, setUser: Function, isLoading: boolean, setIsLoading: Function}}
     * @description Valor proporcionado por el contexto de autenticación a toda la aplicación.
     */
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
                {/** 
                 * Pantalla principal de la aplicación, que contiene las pestañas (Home, User).
                 * Se vuelve a montar si cambia la foto del usuario (`key` dinámica).
                 */}
                <Stack.Screen name="Main" options={{headerShown: false}}>
                {() => <TabNavigator key={user?.photoURL || 'no-photo'} />}
                </Stack.Screen>
            </Stack.Navigator>
        </AuthContext.Provider>
    )        
}

export default AppNavigator