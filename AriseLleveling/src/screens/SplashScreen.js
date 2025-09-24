import React, {useEffect} from 'react'
import { StyleSheet, View, Text} from 'react-native'

const SplashScreen = ({navigation}) =>{
    useEffect(() => {
        const timer = setimeout(() => {
            navigation.replace('Home')
        }, 3000)
        return () => clearTimeout(timer)
    }, [navigation])
    return(
        <view style={styles.container}>
            <Text>Loading...</Text>
            <image souce={require ('../../assets/splash-icon.png')} style={styles.logo}></image>
        </view>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0000008b',
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