import React, {useEffect} from 'react'
import {StyleSheet, Image, View} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import * as Progress from 'react-native-progress'
import colors from '../constants/colors'

const SplashScreen = ({navigation}) =>{

    const Navigation = useNavigation();
    const [progress, setProgress] = React.useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 3500)
        
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