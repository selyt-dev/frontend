import Main from "./views/Main.js";
import Register from "./views/Register.js";
import Login from "./views/Login.js";
import Start from "./views/Start.js";
import Account from "./views/account/Account.js";
import AccountSettings from "./views/account/AccountSettings.js";
import AccountAds from "./views/account/AccountAds.js";
import CreateAd from "./views/ad/CreateAd.js";
import SeeAd from "./views/ad/SeeAd.js";
import EditAd from "./views/ad/EditAd.js";
import SelectCategory from "./views/ad/SelectCategory.js";
import SelectCategoryForSearch from "./views/ad/SelectCategoryForSearch.js";
import SearchAdsByCategory from "./views/ad/SearchAdsByCategory.js";
import FavoriteAds from "./views/ad/FavoriteAds.js";
import ChatList from "./views/chat/ChatList.js";
import Chat from "./views/chat/Chat.js";
import SearchAds from "./views/ad/SearchAds.js";

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
import * as NavigationBar from "expo-navigation-bar";

import { DefaultTheme, DarkTheme } from "./utils/react/themes/index.js";

import AppLoading from "expo-app-loading";

import * as SecureStore from "expo-secure-store";
import API from "./utils/API.js";

import { getAndStoreUserData } from "./utils/react/DataStore";

import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://d542c4e9dee84aaca56a1677544b8e09@o1266838.ingest.sentry.io/6452288',
  enableInExpoDevelopment: true,
  debug: true,
});


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

  NavigationBar.setBackgroundColorAsync(
    colorScheme === "dark" ? "#222222" : "#fcfcfc"
  );
  NavigationBar.setButtonStyleAsync(colorScheme === "dark" ? "light" : "dark");

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
                name="SearchAds"
                options={{ headerShown: false }}
                component={SearchAds}
              />
              <Stack.Screen
                name="CreateAd"
                options={{ headerShown: false }}
                component={CreateAd}
              />
              <Stack.Screen
                name="FavoriteAds"
                options={{ headerShown: false }}
                component={FavoriteAds}
              />
              <Stack.Screen
                name="ChatList"
                options={{ headerShown: false }}
                component={ChatList}
              />
              <Stack.Screen
                name="Chat"
                options={{ headerShown: false }}
                component={Chat}
              />
              <Stack.Screen
                name="SelectCategory"
                options={{ headerShown: false }}
                component={SelectCategory}
              />
              <Stack.Screen
                name="SearchAdsByCategory"
                options={{ headerShown: false }}
                component={SearchAdsByCategory}
              />
              <Stack.Screen
                name="SelectCategoryForSearch"
                options={{ headerShown: false }}
                component={SelectCategoryForSearch}
              />
              <Stack.Screen
                name="SeeAd"
                options={{ headerShown: false }}
                component={SeeAd}
              />
              <Stack.Screen
                name="EditAd"
                options={{ headerShown: false }}
                component={EditAd}
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
                name="AccountAds"
                options={{ headerShown: false }}
                component={AccountAds}
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
                name="SearchAds"
                options={{ headerShown: false }}
                component={SearchAds}
              />
              <Stack.Screen
                name="CreateAd"
                options={{ headerShown: false }}
                component={CreateAd}
              />
              <Stack.Screen
                name="FavoriteAds"
                options={{ headerShown: false }}
                component={FavoriteAds}
              />
              <Stack.Screen
                name="ChatList"
                options={{ headerShown: false }}
                component={ChatList}
              />
              <Stack.Screen
                name="Chat"
                options={{ headerShown: false }}
                component={Chat}
              />
              <Stack.Screen
                name="SelectCategory"
                options={{ headerShown: false }}
                component={SelectCategory}
              />
              <Stack.Screen
                name="SearchAdsByCategory"
                options={{ headerShown: false }}
                component={SearchAdsByCategory}
              />
              <Stack.Screen
                name="SelectCategoryForSearch"
                options={{ headerShown: false }}
                component={SelectCategoryForSearch}
              />
              <Stack.Screen
                name="SeeAd"
                options={{ headerShown: false }}
                component={SeeAd}
              />
              <Stack.Screen
                name="EditAd"
                options={{ headerShown: false }}
                component={EditAd}
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
                name="AccountAds"
                options={{ headerShown: false }}
                component={AccountAds}
              />
            </>
          )}
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent(appName, () => App);
