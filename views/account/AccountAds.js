import { Card, IconButton } from "react-native-paper";
import React from "react";
import { StyleSheet, Text, StatusBar, SafeAreaView } from "react-native";

import API from "../../utils/API";

import { NativeModules } from "react-native";

import { THEME_OBJECT, IS_DARK_THEME } from "../../utils/react/ThemeModule";

import AdCard from "../components/AdCard";

import * as SecureStore from "expo-secure-store";

import moment from "moment/min/moment-with-locales";
import "moment/locale/en-gb";
import "moment/locale/pt";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

module.exports = class AccountAds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      formatter: null,
    };
  }

  async componentDidMount() {
    moment.locale(
      NativeModules.I18nManager.localeIdentifier.replace(/_[a-zA-Z]*/g, "")
    );
    const formatter = new Intl.NumberFormat(
      NativeModules.I18nManager.localeIdentifier.replace("_", "-"),
      {
        style: "currency",
        currency: "EUR",
      }
    );
    this.setState({ formatter });

    const authorization = await SecureStore.getItemAsync("authorization");
    const response = await API.getMyAds(authorization).then((res) =>
      res.json()
    );

    if (response.ads) {
      this.setState({ ads: response.ads });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          style={styles.insideContainer}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
        >
          <Card style={styles.card}>
            <Card.Content style={styles.adCard}>
              <IconButton
                icon="arrow-circle-left"
                onPress={() => this.props.navigation.goBack()}
                color={THEME_OBJECT.colors.customSelectionColor}
                size={38}
              />
              <Text style={styles.logoText}>Os seus anúncios</Text>
            </Card.Content>

            <Card.Content style={styles.card}>
              <Text>&nbsp;</Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content style={styles.adsCard}>
              {this.state.ads?.length > 0 ? (
                this.state.ads?.map((ad) => <AdCard ad={ad} key={ad.id} />)
              ) : (
                <Text style={styles.text}>Nenhum anúncio encontrado</Text>
              )}
            </Card.Content>
          </Card>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#fff",
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
    paddingTop: StatusBar.currentHeight,
  },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 24,
    marginTop: 10,
    color: THEME_OBJECT.colors.text,
  },
  sub: {
    fontSize: 14,
    marginTop: 8,
    color: THEME_OBJECT.colors.text,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 8,
    color: THEME_OBJECT.colors.text,
  },
  insideContainer: {
    flex: 1,
    color: THEME_OBJECT.colors.text,
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
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
  logoText: {
    fontFamily: "CoolveticaRegular",
    fontSize: 35,
    color: THEME_OBJECT.colors.text,
  },
  subLogoText: {
    fontFamily: "CoolveticaRegular",
    fontSize: 24,
    color: THEME_OBJECT.colors.text,
  },
  textInput: {
    marginBottom: 7,
    color: THEME_OBJECT.colors.text,
  },
  adCard: {
    flex: 1,
    //alignContent: "center",
    flexDirection: "row",
    alignItems: "baseline",
    //justifyContent: "center",
  },
  adsCard: {
    flex: 1,
    flexWrap: "wrap",
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    //    flexDirection: "row",
  },
  logout: {
    color: "#ff3b3b",
  },
  text: {
    color: THEME_OBJECT.colors.text,
  },
});
