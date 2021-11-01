import * as Animatable from 'react-native-animatable'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Sae } from 'react-native-textinput-effects'
import React, { useRef } from 'react'
import { StyleSheet, Image, Text, View, Button, TextInput } from 'react-native'
import { useFonts } from 'expo-font'

export default function App () {
  const state = useRef({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    nif: ''
  })

  const [loaded] = useFonts({
    CoolveticaRegular: require('./assets/fonts/coolvetica-rg.ttf'),
    MontserratRegular: require('./assets/fonts/Montserrat-Regular.ttf')
  })

  if (!loaded) {
    return null
  }

  return (
    <Animatable.View style={styles.container}>
      <Animatable.Image
        animation='fadeInUp'
        style={styles.image}
        source={require('./assets/selyt-transparent.png')}
      />
      <Animatable.Text animation='fadeInUp' style={styles.logoText}>
        Selyt
      </Animatable.Text>

      <Text>&nbsp;</Text>

      <Animatable.View animation='fadeInUp' style={styles.fixToText}>
        <Button
          style={styles.button}
          title='Login'
          color='#333333'
          onPress={() => Alert.alert('Left button pressed')}
        />
        <Text>&nbsp;</Text>
        <Text>&nbsp;</Text>
        <Text>&nbsp;</Text>
        <Button
          style={styles.button}
          title='Registo'
          color='#333333'
          onPress={() => Alert.alert('Right button pressed')}
        />
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
  button: {
    width: '100%',
    backgroundColor: '#fff',
  },
  logoText: {
    color: '#fff',
    fontFamily: 'CoolveticaRegular',
    fontSize: 35
  }
})
