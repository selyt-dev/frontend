import Main from './views/Main.js'

import { Provider as PaperProvider } from 'react-native-paper'
import { AppRegistry } from 'react-native'
import React from 'react'
import { name as appName } from './app.json';
import { useFonts } from 'expo-font'
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const [loaded] = useFonts({
    CoolveticaRegular: require('./assets/fonts/coolvetica-rg.ttf'),
    MontserratRegular: require('./assets/fonts/Montserrat-Regular.ttf')
  })

  if (!loaded) {
    return null
  }

  return (
    <NavigationContainer>
      <PaperProvider>
        <Main />
      </PaperProvider>
    </NavigationContainer>
  )
}

AppRegistry.registerComponent(appName, () => App);