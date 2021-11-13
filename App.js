import Main from './views/Main.js'
import Register from './views/Register.js'
import Login from './views/Login.js'
import Start from './views/Start.js'

import { Provider as PaperProvider } from 'react-native-paper'
import { AppRegistry } from 'react-native'
import React from 'react'
import { name as appName } from './app.json'
import { useFonts } from 'expo-font'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import AppLoading from 'expo-app-loading'

import * as SecureStore from 'expo-secure-store'

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  const [loaded] = useFonts({
    CoolveticaRegular: require('./assets/fonts/coolvetica-rg.ttf'),
    MontserratRegular: require('./assets/fonts/Montserrat-Regular.ttf')
  })

  if (!loaded) {
    return null
  }

  async function loadResourcesAsync() {
    const token = await SecureStore.getItemAsync('authorization')
    
    if (token) {
      setIsSignedIn(true)
    }

    return true
  }

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    )
  }

    return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator>
        {isSignedIn ? (
            <>
              <Stack.Screen name="Start" options={{ headerShown: false }} component={Start} />
            </>
          ) : (
            <>
              <Stack.Screen name="Main" options={{ headerShown: false }} component={Main} />
              <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
              <Stack.Screen name="Register" options={{ headerShown: false }} component={Register} />
            </>
          )}
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  )
}

AppRegistry.registerComponent(appName, () => App);