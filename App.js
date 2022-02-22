import Main from "./views/Main.js";
import Register from "./views/Register.js";
import Login from "./views/Login.js";
import Start from "./views/Start.js";
import Account from "./views/account/Account.js";
import AccountSettings from "./views/account/AccountSettings.js";
import CreateAd from "./views/ad/CreateAd.js";
import SeeAd from "./views/ad/SeeAd.js";
import SelectCategory from "./views/ad/SelectCategory.js";

import "intl";
import "intl/locale-data/jsonp/pt-PT";
import "intl/locale-data/jsonp/en-US";
import "react-intl";

import { Provider as PaperProvider, ThemeProvider } from "react-native-paper";
import { AppRegistry, StatusBar, useColorScheme } from "react-native";
import React from "react";
import { name as appName } from "./app.json";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { navigationRef } from "./utils/react/RootNavigation";
import { IS_DARK_THEME, THEME_OBJECT } from "./utils/react/ThemeModule";

import { DefaultTheme, DarkTheme } from "./utils/react/themes/index.js";

import AppLoading from "expo-app-loading";

import * as SecureStore from "expo-secure-store";
import API from "./utils/API.js";

import { getAndStoreUserData } from "./utils/react/DataStore";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  const [loaded] = useFonts({
    CoolveticaRegular: require("./assets/fonts/coolvetica-rg.ttf"),
    MontserratRegular: require("./assets/fonts/Montserrat-Regular.ttf"),
  });

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  if (!loaded) {
    return null;
  }

  async function loadResourcesAsync() {
    const token = await SecureStore.getItemAsync("authorization");

    if (token) {
      try {
        const res = await API.getSelf(token);
        const data = await res.json();

        if (data.user) {
          await getAndStoreUserData(token);
          setIsSignedIn(true);
        } else {
          await SecureStore.setItemAsync("authorization", "");
          await SecureStore.setItemAsync("isAuthenticated", "false");
          setIsSignedIn(false);
        }
      } catch (err) {
        setIsSignedIn(false);
      }
    }

    return true;
  }

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.primary}
          translucent={true}
        />
        <Stack.Navigator>
          {isSignedIn ? (
            <>
              <Stack.Screen
                name="Start"
                options={{ headerShown: false }}
                component={Start}
              />
              <Stack.Screen
                name="CreateAd"
                options={{ headerShown: false }}
                component={CreateAd}
              />
              <Stack.Screen
                name="SelectCategory"
                options={{ headerShown: false }}
                component={SelectCategory}
              />
              <Stack.Screen
                name="SeeAd"
                options={{ headerShown: false }}
                component={SeeAd}
              />
              <Stack.Screen
                name="Account"
                options={{ headerShown: false }}
                component={Account}
              />
              <Stack.Screen
                name="AccountSettings"
                options={{ headerShown: false }}
                component={AccountSettings}
              />
              <Stack.Screen
                name="Main"
                options={{ headerShown: false }}
                component={Main}
              />
              <Stack.Screen
                name="Login"
                options={{ headerShown: false }}
                component={Login}
              />
              <Stack.Screen
                name="Register"
                options={{ headerShown: false }}
                component={Register}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Main"
                options={{ headerShown: false }}
                component={Main}
              />
              <Stack.Screen
                name="Login"
                options={{ headerShown: false }}
                component={Login}
              />
              <Stack.Screen
                name="Register"
                options={{ headerShown: false }}
                component={Register}
              />
              <Stack.Screen
                name="Start"
                options={{ headerShown: false }}
                component={Start}
              />
              <Stack.Screen
                name="CreateAd"
                options={{ headerShown: false }}
                component={CreateAd}
              />
              <Stack.Screen
                name="SelectCategory"
                options={{ headerShown: false }}
                component={SelectCategory}
              />
              <Stack.Screen
                name="SeeAd"
                options={{ headerShown: false }}
                component={SeeAd}
              />
              <Stack.Screen
                name="Account"
                options={{ headerShown: false }}
                component={Account}
              />
              <Stack.Screen
                name="AccountSettings"
                options={{ headerShown: false }}
                component={AccountSettings}
              />
            </>
          )}
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent(appName, () => App);
