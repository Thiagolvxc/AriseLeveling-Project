/**
 * @file imageService.js
 * @description Servicio para manejar selección, permisos y carga de imágenes
 * utilizando Expo Image Picker y Cloudinary.
 */

import * as ImagePicker from 'expo-image-picker';

/**
 * @constant {string}
 * @description Nombre del cloud configurado en Cloudinary.
 * Se obtiene de las variables de entorno públicas de Expo.
 */
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';

/**
 * @constant {string}
 * @description Nombre del preset de carga configurado en Cloudinary.
 * Se obtiene de las variables de entorno públicas de Expo.
 */
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset';

/**
 * @function requestImagePermission
 * @async
 * @description Solicita permisos para acceder a la galería de imágenes del dispositivo.
 *
 * @returns {Promise<boolean>} `true` si el permiso fue concedido, `false` en caso contrario.
 */
export const requestImagePermission = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('lo siento, necesitamos permisos para acceder a tus fotos.');
        return false;
    }
    return true;
}

/**
 * @function pickImage
 * @async
 * @description Abre la galería del dispositivo para seleccionar una imagen.
 * Requiere permisos previos del usuario. Si el usuario cancela, retorna `null`.
 *
 * @returns {Promise<Object|null>} Objeto con los datos de la imagen seleccionada o `null` si se cancela.
 * @example
 * const image = await pickImage();
 * if (image) console.log(image.uri);
 */
export const pickImage = async () => {
    const hasPermission = await requestImagePermission();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
        mediatypes: 'images',
        allowsEditing: false,
        quality: 0.8,
    });

    if (!result.canceled) {
        return result.assets[0];
    }
    return null;
};

/**
 * @function uploadImageToCloudinary
 * @async
 * @description Carga una imagen a Cloudinary utilizando su API.
 *
 * @param {string} imageUri - URI local de la imagen seleccionada.
 * @returns {Promise<string>} URL pública (`secure_url`) de la imagen subida a Cloudinary.
 *
 * @throws {Error} Si ocurre un error durante la carga.
 *
 * @example
 * const imageUrl = await uploadImageToCloudinary('file:///path/to/image.jpg');
 * console.log('URL de Cloudinary:', imageUrl);
 */
export const uploadImageToCloudinary = async (imageUri) => {
    try {
        const formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'profile_image.jpg',
        });
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Error al subir la imagen');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
    }
};

/**
 * @function selectAndUploadImage
 * @async
 * @description Combina la selección y carga de imagen en una sola función.
 * Permite al usuario elegir una imagen y la sube directamente a Cloudinary.
 *
 * @returns {Promise<string|null>} URL de la imagen subida o `null` si el proceso falla o se cancela.
 *
 * @example
 * const imageUrl = await selectAndUploadImage();
 * if (imageUrl) console.log('Imagen subida a:', imageUrl);
 */
export const selectAndUploadImage = async () => {
    try {
        const imageAsset = await pickImage();
        if (!imageAsset) return null;

        const imageUrl = await uploadImageToCloudinary(imageAsset.uri);
        return imageUrl;
    } catch (error) {
        console.error('Error in selectAndUploadImage:', error);
        alert('Error al subir la imagen. Por favor, inténtalo de nuevo.');
    return null;
    }
};