import Main from './views/Main.js'
import Register from './views/Register.js'

import { Provider as PaperProvider } from 'react-native-paper'
import { AppRegistry } from 'react-native'
import React from 'react'
import { name as appName } from './app.json'
import { useFonts } from 'expo-font'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator();

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
        <Stack.Navigator>
          <Stack.Screen name="Main" options={{ headerShown: false }} component={Main} />
          <Stack.Screen name="Register" options={{ headerShown: false }} component={Register} />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  )
}

AppRegistry.registerComponent(appName, () => App);