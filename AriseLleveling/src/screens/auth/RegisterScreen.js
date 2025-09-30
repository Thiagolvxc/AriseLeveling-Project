import React, {useState} from 'react'
import {useNavigation} from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {View, Text, Image, StyleSheet, TextInput, TouchableOpacity} from 'react-native'
import colors from '../../constants/colors'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../../services/firebaseConfig'
import {updateProfile} from 'firebase/auth'

const RegisterScreen = ({navigation}) => {
    const Navigation = useNavigation();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [errorMessages, setErrorMessages] = useState('')

    const handleRegister = () => {
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            updateProfile(user, {displayName: name}).then(() => {
                console.log('El usuario se ha registrado con el nombre', user.displayName);
                navigation.navigate('Login',{screen:'LoginScreen'})
            }).catch((error) => {
                setError(true);
                setErrorMessages(error.message);
            })
        })
        .catch((error) => {
                setError(true);
                setErrorMessages(error.message);
        });
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/logo.png')} style={styles.logo}/>
            <Text style={styles.title}>Crea una Nueva Cuenta</Text>
            <View style={styles.inputContainer}>
                <Icon name="account-outline" size={20} style={styles.icon}/>
                <TextInput 
                    style={styles.input}
                    placeholder="Nombre"
                    value={name}
                    onChangeText={setName}/>
            </View>

            <View style={styles.inputContainer}>
                <Icon name="email-outline" size={20} style={styles.icon}/>
                <TextInput 
                    style={styles.input}
                    placeholder="Correo Electrónico"
                    value={email}
                    onChangeText={setEmail}/>
            </View>

            <View style={styles.inputContainer}>
                <Icon name="lock-outline" size={20} style={styles.icon}/>
                <TextInput 
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry/>
            </View>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Registrarse</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Inicia Sesión</Text>
                </TouchableOpacity>
            </View>
        </View> 
    )
}


const styles = StyleSheet.create({
    container:{
        flex:   1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.variante1,
        paddingHorizontal:  20,
    },
    logo:{
        width:  100,
        height: 100,
        marginBottom:   20,
        resizeMode: 'contain'
    },
    icon:{
        marginRight: 10,
    },
    title:{
        fontSize:   18,
        fontWeight: 600,
        marginBottom:   20,
        color: colors.luminous,
    },
    inputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: colors.delicate,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: colors.variante3,
    },
    input:{
        flex: 1,
        height: 50,
        fontSize: 16,
        color: colors.thin,
    },
    forgotPassword:{
        color: colors.variante8,
        fontSize: 14,
        marginBottom: 20,
    },
    registerButton:{
        backgroundColor: colors.principal,
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        marginBottom: 30,
    },
    registerButtonText:{
        color: colors.luminous,
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerContainer:{
        flexDirection: 'row',
    },
    registerText:{
        color: colors.subtle,
    },
    registerLink:{
        color: colors.variante3,
        fontSize: 14,
        fontWeight: 'bold',
    },
    errorMessage:{
        color: colors.error,
        marginBottom: 10,
        fontSize: 14,
    }

})

export default RegisterScreen