import * as Animatable from "react-native-animatable";
import { Button } from "react-native-paper";
import React from "react";
import { StyleSheet, Text } from "react-native";

import { IS_DARK_THEME, THEME_OBJECT } from "../utils/react/ThemeModule";

module.exports = class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Animatable.View style={styles.container}>
        <Animatable.Image
          animation="fadeInUp"
          style={styles.image}
          source={
            IS_DARK_THEME
              ? require("../assets/selyt-transparent.png")
              : require("../assets/selyt-transparent-inverted.png")
          }
        />
        <Animatable.Text animation="fadeInUp" style={styles.logoText}>
          Selyt
        </Animatable.Text>

        <Text>&nbsp;</Text>

        <Animatable.View animation="fadeInUp" style={styles.fixToText}>
          <Button
            mode="contained"
            dark={IS_DARK_THEME}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            Login
          </Button>
          <Text>&nbsp;</Text>
          <Text>&nbsp;</Text>
          <Text>&nbsp;</Text>
          <Button
            mode="contained"
            dark={IS_DARK_THEME}
            onPress={() => this.props.navigation.navigate("Register")}
          >
            Registo
          </Button>
        </Animatable.View>
      </Animatable.View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#fff",
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
    alignItems: "center",
    justifyContent: "center",
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container2: {
    width: "100%",
  },
  image: {
    width: 150,
    height: 150,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: 320,
    height: 320,
  },
  logoText: {
    color: THEME_OBJECT.colors.text,
    fontFamily: "CoolveticaRegular",
    fontSize: 35,
  },
});
