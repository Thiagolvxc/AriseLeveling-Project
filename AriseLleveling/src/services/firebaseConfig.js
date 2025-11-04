/**
 * @file firebaseConfig.js
 * @description Configuración e inicialización de Firebase para la aplicación React Native con Expo.
 * Incluye la configuración de Firebase Authentication, Firestore y Cloud Storage,
 * utilizando persistencia local a través de AsyncStorage.
 */

import {initializeApp} from "firebase/app"
import {initializeAuth, getReactNativePersistence} from "firebase/auth"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import {getStorage} from "firebase/storage"
import {getFirestore} from "firebase/firestore"

/**
 * @constant {Object} firebaseConfig
 * @description Configuración principal de Firebase.
 * Los valores son obtenidos desde las variables de entorno públicas de Expo.
 * 
 * @property {string} apiKey - Clave de API pública del proyecto Firebase.
 * @property {string} authDomain - Dominio de autenticación configurado en Firebase.
 * @property {string} projectId - ID único del proyecto Firebase.
 * @property {string} storageBucket - URL del bucket de almacenamiento de Firebase Storage.
 * @property {string} messagingSenderId - ID del remitente de Cloud Messaging.
 * @property {string} appId - Identificador único de la aplicación Firebase.
 */
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID
};


/**
 * @constant {FirebaseApp}
 * @description Instancia principal de la aplicación Firebase.
 * Inicializa los servicios de Firebase con la configuración definida.
 */
const app = initializeApp(firebaseConfig);

/**
 * @constant {Auth}
 * @description Instancia del servicio de autenticación de Firebase.
 * Se inicializa con persistencia local usando AsyncStorage,
 * lo que permite mantener la sesión del usuario incluso tras cerrar la app.
 */
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

/**
 * @constant {FirebaseStorage}
 * @description Instancia del servicio de almacenamiento de Firebase.
 * Se usa para almacenar y recuperar archivos (como imágenes de perfil).
 */
const storage = getStorage(app);

/**
 * @constant {Firestore}
 * @description Instancia de Firestore, base de datos NoSQL en la nube de Firebase.
 * Se utiliza para almacenar y sincronizar datos estructurados.
 */
export const db = getFirestore(app);

/**
 * @exports auth
 * @exports storage
 * @description Exporta las instancias de autenticación y almacenamiento de Firebase
 * para ser utilizadas en toda la aplicación.
 */
export {auth, storage};