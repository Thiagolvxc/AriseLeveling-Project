import React from 'react'
import {Text, StyleSheet} from 'react-native'
import colors from '../constants/colors'
import {LinearGradient} from 'expo-linear-gradient'

const UserScreen = () => {
  return (
    <LinearGradient colors={colors.gradienteTerciario} style={styles.container}>
      <Text style={styles.text}>User</Text>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },

  text:{
    color: colors.luminous,
    fontSize: 20,
    fontWeight: 'bold',
  }
})

export default UserScreen