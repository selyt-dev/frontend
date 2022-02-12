import { TextInput, Card } from "react-native-paper";
import React from "react";
import {
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Pressable,
} from "react-native";

import AdCard from "./components/AdCard";
import Footer from "./components/Footer";

import { THEME_OBJECT } from "../utils/react/ThemeModule";

import API from "../utils/API";

module.exports = class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      ads: [],
    };
  }

  async componentDidMount() {
    const res = await API.getAds().then((res) => res.json());
    this.setState({ ads: res.ads });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          label="O que procura?"
          value={this.state.search}
          style={styles.textInput}
          onChangeText={(text) => this.setState({ search: text })}
          left={<TextInput.Icon name="magnify" />}
        />

        <ScrollView style={styles.insideContainer}>
          <Pressable onPress={() => console.log("Ver todas as categorias")}>
            <Card>
              <Card.Title title="Explorar por Categoria" subtitle="Ver Todas" />
            </Card>
          </Pressable>

          <Text>&nbsp;</Text>

          <Card>
            <Card.Title title="Anúncios Recomendados" />
            <Card.Content style={styles.adCard}>
              {this.state.ads?.length > 0 ? (
                this.state.ads?.map((ad) => (
                  <AdCard
                    key={ad.id}
                    id={ad.id}
                    title={ad.title}
                    price={ad.price}
                    region={ad.region}
                    createdAt={ad.createdAt}
                  />
                ))
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
