import { DarkTheme } from "react-native-paper";

const theme = {
  ...DarkTheme,
  // roundness: 2,
  colors: {
    ...DarkTheme.colors,
    primary: "#222222",
    accent: "#c0e3f2",
    customBackgroundColor: "#222222",
    customPartialSelectionColor: "#c0e3f2",
    customSelectionColor: "#c0e3f2",
    customLightBackgroundColor: "#333333",
  },
};

export default theme;
