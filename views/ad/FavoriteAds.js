import { Card } from "react-native-paper";
import React from "react";
import {
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from "react-native";

import AdCard from "../components/AdCard";

import { THEME_OBJECT } from "../../utils/react/ThemeModule";

import * as SecureStore from "expo-secure-store";

import { getItemAsync } from "../../utils/react/DataStore";

import Footer from "../components/Footer";

import API from "../../utils/API";

module.exports = class FavoriteAds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
    };
  }

  async componentDidMount() {
    const favorites = (await getItemAsync("favorites", true)) || [];
    const authorization = await SecureStore.getItemAsync("authorization");

    const res = await API.getMultipleAds(favorites, authorization)
      .then((res) => res.json())
      .catch((err) => console.log(err));

    this.setState({ ads: res.ads });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.insideContainer}>
          <Card>
            <Card.Title title="Anúncios Favoritos" />
            <Card.Content style={styles.adCard}>
              {this.state.ads?.length > 0 ? (
                this.state.ads?.map((ad) => <AdCard ad={ad} key={ad.id} />)
              ) : (
                <Text style={styles.text}>Nenhum anúncio encontrado</Text>
              )}
            </Card.Content>
          </Card>
        </ScrollView>
        <Footer />
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
  insideContainer: {
    flex: 1,
    color: "#fff",
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
    marginBottom: 56,
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
    color: "#fff",
    fontFamily: "CoolveticaRegular",
    fontSize: 35,
  },
  textInput: {
    marginBottom: 7,
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
  },
  adCard: {
    flex: 1,
    flexWrap: "wrap",
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    color: THEME_OBJECT.colors.text,
  },
});
