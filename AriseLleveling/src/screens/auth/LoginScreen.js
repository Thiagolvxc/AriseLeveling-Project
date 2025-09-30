import React, {useState} from 'react'
import {View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../../services/firebaseConfig'
import colors from '../../constants/colors'
import {useNavigation} from '@react-navigation/native'

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [errorMessages, setErrorMessages] = useState('')
    const Navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
    }

    setError('');
        
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        Alert.alert('Éxito', 'Inicio de sesión exitoso', [
            {text: 'OK', onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            })}
        ]);
    }catch (error) {
            console.error('Error al iniciar sesión:', error);
            
            let errorMessage = 'Error al iniciar sesión';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No existe una cuenta con este correo electrónico';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'El formato del correo electrónico no es válido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Esta cuenta ha sido deshabilitada';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de conexión. Verifica tu internet';
                    break;
                default:
                    errorMessage = error.message || 'Error desconocido';
            }
            
            setError(errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/logo.png')} style={styles.logo}/>
            <Text style={styles.title}>Inicia sesion con tu Cuenta</Text>
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
                    onChangeText={setPassword}/>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerLink}>Regístrate aqui</Text>
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
    loginButton:{
        backgroundColor: colors.variante6,
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        marginBottom: 30,
    },
    loginButtonText:{
        color: colors.luminous,
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerContainer:{
        flexDirection: 'row',
    },
    registerText:{
        color: colors.default,
    },
    registerLink:{
        color: colors.variante6,
        fontSize: 14,
        fontWeight: 'bold',
    },
    errorMessage:{
        color: colors.error,
        marginBottom: 10,
        fontSize: 14,
    }

})

export default LoginScreen