/**
 * @file SplashScreen.jsx
 * @description Pantalla de presentación (splash) que se muestra al iniciar la aplicación.
 * Incluye una animación de carga y redirige automáticamente al login después de unos segundos.
 */

import React, {useEffect} from 'react'
import {StyleSheet, Image, View} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import * as Progress from 'react-native-progress'
import colors from '../constants/colors'

/**
 * @component SplashScreen
 * @description Componente de pantalla de bienvenida o carga inicial.
 * Muestra un progreso animado y redirige a la pantalla de login tras un tiempo definido.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {import('@react-navigation/native').NavigationProp} props.navigation - Objeto de navegación de React Navigation.
 * 
 * @returns {JSX.Element} Pantalla de presentación con animación de carga.
 */
const SplashScreen = ({navigation}) =>{

    /**
     * @constant {import('@react-navigation/native').NavigationProp}
     * @description Hook para obtener la navegación actual. Se utiliza para realizar redirecciones.
     */
    const Navigation = useNavigation();

    /**
     * @state progress
     * @type {number}
     * @description Estado que controla el progreso de la animación de carga (rango de 0 a 1).
     */
    const [progress, setProgress] = React.useState(0);

    /**
     * useEffect - Inicia los temporizadores de animación y navegación.
     * 
     * - Navega automáticamente a la pantalla 'Login' después de 5 segundos.
     * - Incrementa el progreso visual cada 100 ms hasta alcanzar el valor máximo (1.0).
     * 
     * Se limpian los intervalos y temporizadores cuando el componente se desmonta.
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 5000)
        
        let interval = setInterval(() => {
            setProgress(prev => {
                if (prev < 1) {
                    return prev + 0.02;
                } else {
                    clearInterval(interval);
                    return 1;
                }
            });
        }, 100);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [navigation]);


    return(
        <View colors={colors.variante3} style={styles.container}>
            <Image source={require ('../../assets/logo.png')} style={styles.logo}></Image>
            <Progress.Bar progress={progress} width={200} color="#3e00f8" style={styles.loader}/>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },

    loader: {
        marginTop: 20,
    },

})

export default SplashScreen