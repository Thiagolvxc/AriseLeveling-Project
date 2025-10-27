import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset';

export const requestImagePermission = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('lo siento, necesitamos permisos para acceder a tus fotos.');
        return false;
    }
    return true;
}

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