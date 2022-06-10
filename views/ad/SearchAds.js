import { TextInput, Card, Text } from "react-native-paper";
import React from "react";
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Pressable,
  TextInputComponent,
} from "react-native";

import { THEME_OBJECT } from "../../utils/react/ThemeModule";

import * as SecureStore from "expo-secure-store";

import API from "../../utils/API";
import AdCard from "../components/AdCard";

module.exports = class SearchAds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      ads: [],
    };

    this.searchAds = this.searchAds.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  async searchAds() {
    if (this.state.search?.length > 0) {
      const authorization = await SecureStore.getItemAsync("authorization");
      const res = await API.searchAds(authorization, this.state.search).then(
        (res) => res.json()
      );
      this.setState({ ads: res.ads });
    }
  }

  async goBack() {
    return this.props.navigation.navigate("Start");
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          label="O que procura?"
          value={this.state.search}
          style={styles.textInput}
          onChangeText={(text) => this.setState({ search: text })}
          left={<TextInput.Icon name="close" onPress={this.goBack} />}
          right={<TextInput.Icon name="search" onPress={this.searchAds} />}
          autoFocus={true}
          selectionColor={THEME_OBJECT.colors.customSelectionColor}
          underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
          activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
        />

        <ScrollView style={styles.insideContainer}>
          <Card>
            <Card.Title title="Anúncios" />
            <Card.Content style={styles.adCard}>
              {this.state.ads?.length > 0 ? (
                this.state.ads?.map((ad) => <AdCard ad={ad} key={ad.id} />)
              ) : (
                <Text style={styles.text}>Nenhum anúncio encontrado</Text>
              )}
            </Card.Content>
          </Card>
        </ScrollView>
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
