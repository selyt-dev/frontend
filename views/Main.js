import * as Animatable from 'react-native-animatable'
import { Button } from 'react-native-paper'
import React from 'react'
import { StyleSheet, Text } from 'react-native'

export default function Main({ navigation }) {
  return (
    <Animatable.View style={styles.container}>
      <Animatable.Image
        animation='fadeInUp'
        style={styles.image}
        source={require('../assets/selyt-transparent.png')}
      />
      <Animatable.Text animation='fadeInUp' style={styles.logoText}>
        Selyt
      </Animatable.Text>

      <Text>&nbsp;</Text>

      <Animatable.View animation='fadeInUp' style={styles.fixToText}>
        <Button
          mode='contained'
          color='#333333'
          dark='true'
          onPress={() => navigation.navigate('Login')}
        >
          Login
        </Button>
        <Text>&nbsp;</Text>
        <Text>&nbsp;</Text>
        <Text>&nbsp;</Text>
        <Button
          mode='contained'
          color='#333333'
          dark='true'
          onPress={() => navigation.navigate('Register')}
        >
          Registo
        </Button>
      </Animatable.View>
    </Animatable.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container2: {
    width: '100%'
  },
  image: {
    width: 150,
    height: 150
  },
  logoText: {
    color: '#fff',
    fontFamily: 'CoolveticaRegular',
    fontSize: 35
  }
})
