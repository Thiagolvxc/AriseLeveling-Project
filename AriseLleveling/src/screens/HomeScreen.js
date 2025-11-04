/**
 * @file HomeScreen.jsx
 * @description Pantalla principal (Home) de la aplicación. 
 * Muestra un diseño básico con fondo en gradiente y texto central.
 */

import React from 'react'
import {Text, StyleSheet} from 'react-native'
import colors from '../constants/colors'
import {LinearGradient} from 'expo-linear-gradient'

/**
 * @component HomeScreen
 * @description Componente de la pantalla principal de la aplicación.
 * Renderiza un fondo con gradiente y un texto central.
 * @returns {JSX.Element} Vista de la pantalla de inicio.
 */
const HomeScreen = () => {
  return (
    
    <LinearGradient colors={colors.gradienteSecundario} style={styles.container}>
      <Text style={styles.text}>Home</Text>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.fondoClaro,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.principal,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: colors.subtle,
  },
})

export default HomeScreen