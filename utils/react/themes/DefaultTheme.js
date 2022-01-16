import { DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  // roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#fafafa",
    accent: "#c0e3f2",
    customBackgroundColor: "#fcfcfc",
    customPartialSelectionColor: "#222222",
    customSelectionColor: "#111111",
    customLightBackgroundColor: "#f3f3f3",
  },
};

export default theme;
