import { Appearance } from "react-native";
import { DefaultTheme, DarkTheme } from "./themes/index";

import * as SecureStore from "expo-secure-store";

module.exports = class ThemeModule {
  static THEME =
    SecureStore.getItemAsync("theme") === "auto"
      ? Appearance.getColorScheme() === "dark"
        ? DarkTheme
        : DefaultTheme
      : SecureStore.getItemAsync("theme") === "dark"
      ? DarkTheme
      : DefaultTheme;
  static IS_DARK_THEME = ThemeModule.THEME === "dark";
  static THEME_OBJECT = ThemeModule.IS_DARK_THEME ? DarkTheme : DefaultTheme;
};
