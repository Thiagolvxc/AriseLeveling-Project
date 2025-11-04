/**
 * @file firestoreService.js
 * @description Servicio de interacción con Firestore y Firebase Authentication.
 * Permite actualizar la foto de perfil del usuario y obtener sus datos desde la colección `users`.
 */

import {getFirestore, doc, setDoc, getDoc} from "firebase/firestore";
import { getAuth, updateProfile } from 'firebase/auth';
import app from './firebaseConfig';

/**
 * @constant {Firestore} db
 * @description Instancia de la base de datos Firestore inicializada con la app de Firebase.
 */
const db = getFirestore(app);

/**
 * @constant {Auth} auth
 * @description Instancia del servicio de autenticación de Firebase.
 */
const auth = getAuth(app);

/**
 * @async
 * @function updateUserProfilePhoto
 * @description Actualiza la foto de perfil del usuario tanto en Firebase Authentication
 * como en su documento correspondiente dentro de Firestore.
 *
 * @param {string} userId - ID único del usuario en Firebase Authentication.
 * @param {string} photoURL - URL pública de la nueva foto de perfil.
 * 
 * @throws {Error} Si `userId` no está definido o si ocurre un error durante la actualización.
 * @returns {Promise<boolean>} Retorna `true` si la actualización se completó correctamente.
 *
 * @example
 * await updateUserProfilePhoto('user123', 'https://miapp.com/fotos/usuario123.jpg');
 */
export const updateUserProfilePhoto = async (userId, photoURL) => {
    if (!userId) {
        throw new Error("Se requiere un ID de usuario para actualizar el perfil.");
    }

    try {
        if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: photoURL });
        }

        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            photoURL: photoURL,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    
        console.log('Foto de perfil actualizada exitosamente en Auth y Firestore.');
        return true;

    } catch (error) {
    console.error('Error updating user profile photo:', error);
    throw error;
    }
};

/**
 * @async
 * @function getUserData
 * @description Obtiene los datos de un usuario desde la colección `users` en Firestore.
 *
 * @param {string} userId - ID único del usuario.
 * @returns {Promise<Object|null>} Objeto con los datos del usuario si el documento existe, o `null` si no.
 *
 * @throws {Error} Si ocurre un error durante la lectura de Firestore.
 *
 * @example
 * const userData = await getUserData('user123');
 * console.log(userData?.photoURL);
 */
export const getUserData = async (userId) => {
    if (!userId) return null;

    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
    
        if (userSnap.exists()) {
        return userSnap.data();
        } else {
            console.warn(`No se encontró un documento para el usuario con ID: ${userId}`);
        return null;
        }
    } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
    }
};