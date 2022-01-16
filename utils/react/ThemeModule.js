import { Appearance } from "react-native";
import { DefaultTheme, DarkTheme } from "./themes/index";

module.exports = class ThemeModule {
  static THEME = Appearance.getColorScheme();
  static IS_DARK_THEME = ThemeModule.THEME === "dark";
  static THEME_OBJECT = ThemeModule.IS_DARK_THEME ? DarkTheme : DefaultTheme;
};
