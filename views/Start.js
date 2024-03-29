import { TextInput, Card } from "react-native-paper";
import React from "react";
import {
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Pressable,
  RefreshControl,
} from "react-native";

import AdCard from "./components/AdCard";
import Footer from "./components/Footer";

import { THEME_OBJECT } from "../utils/react/ThemeModule";

import * as SecureStore from "expo-secure-store";

import API from "../utils/API";

import Socket from "../utils/Socket";

module.exports = class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      ads: [],
      refreshing: false,
    };

    this.redirectToSearch = this.redirectToSearch.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  async componentDidMount() {
    const authorization = await SecureStore.getItemAsync("authorization");
    const res = await API.getAds(authorization).then((res) => res.json());
    this.setState({ ads: res.ads });

    this.socket = new Socket(API.BASE_URL, authorization);
  }

  async redirectToSearch() {
    return this.props.navigation.navigate("SearchAds");
  }

  async refresh() {
    await this.setState({ refreshing: true });

    const authorization = await SecureStore.getItemAsync("authorization");
    const res = await API.getAds(authorization).then((res) => res.json());
    this.setState({ ads: res.ads, refreshing: false });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          label="O que procura?"
          value={this.state.search}
          style={styles.textInput}
          onChangeText={(text) => this.setState({ search: text })}
          onFocus={this.redirectToSearch}
          selectionColor={THEME_OBJECT.colors.customSelectionColor}
          underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
          activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
          left={<TextInput.Icon name="search" />}
        />

        <ScrollView
          style={styles.insideContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refresh}
            />
          }
        >
          <Pressable
            onPress={() =>
              this.props.navigation.navigate("SelectCategoryForSearch")
            }
          >
            <Card>
              <Card.Title title="Explorar por Categoria" subtitle="Ver Todas" />
            </Card>
          </Pressable>

          <Text>&nbsp;</Text>

          <Card>
            <Card.Title title="Anúncios Recomendados" />
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
