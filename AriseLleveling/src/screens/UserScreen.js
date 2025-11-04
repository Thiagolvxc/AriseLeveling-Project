/**
 * @file UserScreen.jsx
 * @description Pantalla de perfil de usuario. Permite ver, actualizar y administrar la información del usuario,
 * incluyendo la foto de perfil y los datos almacenados localmente.
 */

import React from 'react'
import colors from '../constants/colors'
import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import { pickImage, uploadImageToCloudinary } from '../services/cloudinaryService'
import ImagePreviewModal from '../components/ImagePreviewModal'
import { useFocusEffect } from '@react-navigation/native'
import DatosForm from '../components/DatosForm'
import { ScrollView } from 'react-native-gesture-handler'
import { updateUserProfilePhoto, getUserData } from '../services/userService'

/**
 * @component UserScreen
 * @description Pantalla de perfil del usuario autenticado.
 * Permite visualizar los datos del usuario, modificar su foto de perfil
 * y acceder a un formulario local para editar información adicional almacenada en SQLite.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {import('@react-navigation/native').NavigationProp} props.navigation - Objeto de navegación de React Navigation.
 *
 * @returns {JSX.Element} Pantalla de usuario con opciones de edición y carga de datos.
 */
const UserScreen = ({navigation }) => {

  /**
   * @constant {Object} user - Usuario actual obtenido desde el contexto de autenticación.
   */
  const {user} = useAuth();

  /**
   * @state imageUri
   * @type {string|null}
   * @description URI de la imagen actual del usuario (local o remota).
   */
  const [imageUri, setImageUri] = useState(null);

  /**
   * @state userData
   * @type {Object|null}
   * @description Datos adicionales del usuario obtenidos desde Firestore.
   */
  const [userData, setUserData] = useState(null);

  /**
   * @state loading
   * @type {boolean}
   * @description Indica si hay una operación de carga o actualización en progreso.
   */
  const [loading, setLoading] = useState(false);

  /**
   * @state selectedImage
   * @type {Object|null}
   * @description Imagen seleccionada por el usuario antes de subirla.
   */
  const [selectedImage, setSelectedImage] = useState(null);

  /**
   * @state showPreview
   * @type {boolean}
   * @description Controla la visualización previa de la imagen antes de confirmarla.
   */
  const [showPreview, setShowPreview] = useState(false);

  /**
   * @constant {string}
   * @description URL de la imagen por defecto cuando el usuario no tiene foto asignada.
   */
  const defaultImage = 'https://via.placeholder.com/150';

  /**
   * @state showDatosForm
   * @type {boolean}
   * @description Controla la visualización del formulario local (DatosForm) para editar datos almacenados en SQLite.
   */
  const [showDatosForm,setShowDatosForm]= useState(false);

  /**
   * @function fetchUserProfile
   * @async
   * @description Obtiene los datos del perfil del usuario desde Firestore.
   * Si existe una foto de perfil, la muestra; de lo contrario, usa la imagen por defecto.
   */
  const fetchUserProfile = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const firestoreUserData = await getUserData(user.uid);
        setUserData(firestoreUserData);
        setImageUri(firestoreUserData?.photoURL || user.photoURL || defaultImage);
      } catch (error) {
        console.error("Error al obtener datos del perfil:", error);
        setImageUri(user.photoURL || defaultImage); 
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  /**
   * @hook useFocusEffect
   * @description Ejecuta `fetchUserProfile` cada vez que la pantalla obtiene foco,
   * asegurando que los datos se mantengan actualizados.
   */
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

  /**
   * @function toggleDatosForm
   * @description Alterna la visualización del formulario local de datos (DatosForm).
   */
  const toggleDatosForm = () => {
    setShowDatosForm(!showDatosForm);
  };

  /**
   * @function handleImageSelection
   * @async
   * @description Abre el selector de imágenes del dispositivo para elegir una nueva foto de perfil.
   */
  const handleImageSelection = async () => {
    try {
      const imageAsset = await pickImage();
      if (imageAsset) {
        setSelectedImage(imageAsset);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  /**
   * @function handleConfirmUpload
   * @async
   * @description Confirma y sube la imagen seleccionada a Cloudinary.
   * Actualiza la foto de perfil del usuario en Firestore y en el contexto local.
   */
  const handleConfirmUpload = async () => {
    if (!selectedImage) return;

    try {
      setLoading(true);
      setShowPreview(false);

      const imageUrl = await uploadImageToCloudinary(selectedImage.uri);

      await updateUserProfilePhoto(user.uid, imageUrl);

      setImageUri(imageUrl); 
      setSelectedImage(null);
      Alert.alert('Éxito', 'Imagen de perfil actualizada correctamente');

    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'No se pudo actualizar la imagen de perfil');
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function handleCancelSelection
   * @description Cancela la selección de imagen y oculta la vista previa.
   */
  const handleCancelSelection = () => {
    setSelectedImage(null);
    setShowPreview(false);
  };

  return (

    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil de Usuario</Text>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.profileImage} resizeMode="cover"/>

          <TouchableOpacity style={styles.changeImageButton} onPress={handleImageSelection} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.changeImageText}>Cambiar Foto</Text>
            )}
          </TouchableOpacity>

        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.displayName || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <ImagePreviewModal
          visible={showPreview}
          imageUri={selectedImage?.uri}
          loading={loading}
          onConfirm={handleConfirmUpload}
          onCancel={handleCancelSelection}
        />

        <TouchableOpacity style={styles.academicButton} onPress={toggleDatosForm} disabled={loading}>
            <Text style={styles.academicButtonText}>
              {showDatosForm ? 'Ocultar datos': 'Abrir datos'}
            </Text>
          </TouchableOpacity>

          {showDatosForm && <DatosForm onClose={()=> setShowDatosForm(false)}/>}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding: 20,
    backgroundColor: colors.fondoClaro,
  },

  title:{
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.principal,
    textAlign: 'center',
    marginBottom: 30,
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: colors.principal,
  },

  changeImageButton: {
    backgroundColor: colors.principal,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },

  changeImageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  userInfo: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.principal,
    marginBottom: 5,
  },

  userEmail: {
    fontSize: 16,
    color: colors.subtle,
  },
})

export default UserScreen;  