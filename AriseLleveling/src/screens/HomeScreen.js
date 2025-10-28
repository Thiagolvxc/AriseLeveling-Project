import React from 'react'
import {Text, StyleSheet} from 'react-native'
import colors from '../constants/colors'
import {LinearGradient} from 'expo-linear-gradient'

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