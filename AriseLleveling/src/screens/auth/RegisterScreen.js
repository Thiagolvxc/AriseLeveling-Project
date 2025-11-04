/**
 * @file RegisterScreen.jsx
 * @description Pantalla de registro de usuario. 
 * Permite crear una nueva cuenta mediante correo electrónico y contraseña usando Firebase Authentication,
 * y actualiza el perfil del usuario con su nombre.
 */

import React, {useState} from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native'
import colors from '../../constants/colors'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../../services/firebaseConfig'
import {updateProfile} from 'firebase/auth'

/**
 * @component RegisterScreen
 * @description Componente que gestiona el registro de nuevos usuarios en la aplicación.
 * Incluye validaciones de entrada, creación de cuenta en Firebase y manejo de errores específicos.
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.navigation - Objeto de navegación de React Navigation para redirigir entre pantallas.
 * @returns {JSX.Element} Pantalla de registro del usuario.
 */
const RegisterScreen = ({navigation}) => {

    /**
     * @state
     * @type {[string, Function]}
     * @description Estado que almacena el nombre completo del usuario.
     */
    const [name, setName] = useState('')

    /**
     * @state
     * @type {[string, Function]}
     * @description Estado que almacena el correo electrónico ingresado por el usuario.
     */
    const [email, setEmail] = useState('')

    /**
     * @state
     * @type {[string, Function]}
     * @description Estado que almacena la contraseña ingresada por el usuario.
     */
    const [password, setPassword] = useState('')

    /**
     * @state
     * @type {[string, Function]}
     * @description Estado que almacena la confirmación de contraseña ingresada.
     */
    const [confirmPassword, setConfirmPassword] = useState('')

    /**
     * @state
     * @type {[string, Function]}
     * @description Estado que almacena mensajes de error que se muestran al usuario.
     */
    const [error, setError] = useState('')

    /**
     * @async
     * @function handleRegister
     * @description Maneja el proceso de registro de un nuevo usuario.
     * Realiza validaciones de los campos, crea la cuenta en Firebase y actualiza el perfil del usuario.
     * @throws {FirebaseError} Captura errores de Firebase Authentication y muestra mensajes personalizados.
     */
    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError('Todos los campos son obligatorios');
            return;
        }
        
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setError('');
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await updateProfile(user, {
                displayName: name
            });
            
            Alert.alert('Éxito', 'Usuario registrado correctamente', [
                { text: 'OK', onPress: () => navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                }) }
            ]);
        } catch (error) {
            console.error('=== ERROR DE REGISTRO ===');
            console.error('Código de error:', error.code);
            console.error('Mensaje de error:', error.message);
            console.error('Error completo:', error);
            console.error('========================');
            
            let errorMessage = 'Error al registrar usuario';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Ya existe una cuenta con este correo electrónico';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'El formato del correo electrónico no es válido';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es muy débil';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'El registro no está habilitado en Firebase Console';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de conexión. Verifica tu internet y configuración de Firebase';
                    break;
                case 'auth/invalid-api-key':
                    errorMessage = 'API Key de Firebase inválida. Verifica tu configuración';
                    break;
                case 'auth/project-not-found':
                    errorMessage = 'Proyecto de Firebase no encontrado. Verifica tu Project ID';
                    break;
                case 'auth/configuration-not-found':
                    errorMessage = 'Configuración de Firebase no encontrada';
                    break;
                default:
                    errorMessage = `${error.message || 'Error desconocido'} (Código: ${error.code})`;
            }
            
            setError(errorMessage);
        }
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
                    onChangeText={setEmail}
                    keyboardType='email-address'/>
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

            <View style={styles.inputContainer}>
                <Icon name="lock-outline" size={20} style={styles.icon}/>
                <TextInput 
                    style={styles.input}
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry/>
            </View>

            {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Registrarse</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>¿Ya tienes una cuenta?</Text>
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