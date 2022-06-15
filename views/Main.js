import * as Animatable from "react-native-animatable";
import { Button } from "react-native-paper";
import React from "react";
import { StyleSheet, Text, View, Image, StatusBar } from "react-native";

import { IS_DARK_THEME, THEME_OBJECT } from "../utils/react/ThemeModule";
import AppIntroSlider from "react-native-app-intro-slider";

const slides = [
  {
    key: "slide1",
    title: "Bem-vindo(a) à Selyt!",
    text: "A Selyt é uma plataforma de compra e venda de produtos e serviços em segunda mão.",
    image: require("../assets/images/waving-hand.png"),
    backgroundColor: THEME_OBJECT.colors.primary,
  },
  {
    key: "slide2",
    title: "Venda o que já não quer",
    text: "Venda o que não quer, para que possa dar um novo uso aos produtos que já não usa.",
    image: require("../assets/images/trade.png"),
    backgroundColor: THEME_OBJECT.colors.primary,
  },
  {
    key: "slide3",
    title: "Facilidade de uso",
    text: "A nossa aplicação mobile é de fácil uso, com uma interface amigável, intuitiva e familiar, garantindo a qualidade da plataforma.",
    image: require("../assets/images/easy-use.png"),
    backgroundColor: THEME_OBJECT.colors.primary,
  },
];

module.exports = class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
    };

    this._renderItem = this._renderItem.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);
    this._onDone = this._onDone.bind(this);
  }

  _renderItem = ({ item }) => {
    return (
      <View
        style={[
          styles.intro.slide,
          {
            backgroundColor: item.backgroundColor,
          },
        ]}
      >
        <Text style={styles.intro.title}>{item.title}</Text>
        <Text>&nbsp;</Text>
        <Image source={item.image} style={styles.image} />
        <Text>&nbsp;</Text>
        <Text style={styles.intro.text}>{item.text}</Text>
      </View>
    );
  };

  _keyExtractor = (item) => item.title;

  _onDone = () => {
    this.setState({ showRealApp: true });
  };

  render() {
    if (this.state.showRealApp) {
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
    } else {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar translucent backgroundColor="transparent" />
          <AppIntroSlider
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            data={slides}
            showSkipButton={true}
            onDone={this._onDone}
            onSkip={this._onDone}
            activeDotStyle={{ backgroundColor: THEME_OBJECT.colors.text }}
            renderNextButton={() => {
              return <Text style={styles.intro.buttonText}>Próximo</Text>;
            }}
            renderDoneButton={() => {
              return <Text style={styles.intro.buttonText}>Concluído</Text>;
            }}
            renderSkipButton={() => {
              return <Text style={styles.intro.buttonText}>Saltar</Text>;
            }}
          />
        </View>
      );
    }
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
  intro: {
    slide: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "blue",
    },
    image: {
      width: 320,
      height: 320,
      marginVertical: 32,
    },
    text: {
      fontSize: 18,
      padding: 16,
      color: THEME_OBJECT.colors.text,
      textAlign: "center",
    },
    title: {
      fontSize: 36,
      color: THEME_OBJECT.colors.text,
      textAlign: "center",
      fontFamily: "CoolveticaRegular",
    },
    buttonText: {
      color: THEME_OBJECT.colors.text,
      fontSize: 18,
      padding: 12,
    },
  },
});
