/**
 * @file LoginScreen.jsx
 * @description Pantalla de inicio de sesión del usuario.
 * Permite autenticar al usuario mediante correo electrónico y contraseña usando Firebase Authentication.
 */

import React, {useState} from 'react'
import {View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential} from 'firebase/auth'
import {auth} from '../../services/firebaseConfig'
import colors from '../../constants/colors'
import {useNavigation} from '@react-navigation/native'

/**
 * @component LoginScreen
 * @description Componente que gestiona el inicio de sesión de los usuarios.
 * Incluye validaciones de formulario, manejo de errores y navegación posterior al inicio de sesión exitoso.
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.navigation - Objeto de navegación de React Navigation.
 * @returns {JSX.Element} Vista de la pantalla de inicio de sesión.
 */
const LoginScreen = ({navigation}) => {

    /**
     * @state
     * @type {[string, Function]}
     * @description Estado que almacena el correo electrónico del usuario.
     */
    const [email, setEmail] = useState('')

    /**
     * @state
     * @type {[string, Function]}
     * @description Estado que almacena la contraseña del usuario.
     */
    const [password, setPassword] = useState('')

    /**
     * @state
     * @type {[string, Function]}
     * @description Mensaje de error actual mostrado al usuario (por ejemplo, error de validación o autenticación).
     */
    const [error, setError] = useState('')

    /**
     * @state
     * @type {[string, Function]}
     * @description Mensaje adicional de error (actualmente no utilizado, reservado para validaciones más detalladas).
     */
    const [errorMessages, setErrorMessages] = useState('')

    /**
     * @constant
     * @description Hook de navegación para realizar redirecciones dentro de la app.
     */
    const Navigation = useNavigation();

    /**
     * @async
     * @function handleLogin
     * @description Maneja el proceso de inicio de sesión con Firebase Authentication.
     * Realiza validación de campos, autenticación y manejo de errores específicos.
     * @throws {FirebaseError} En caso de que falle la autenticación, se captura y muestra un mensaje apropiado.
     */
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
                    onChangeText={setEmail}
                    keyboardType='email'/>
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
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4285F4',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    googleIcon: {
        marginRight: 10,
    },
    googleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
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