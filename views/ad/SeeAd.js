import {
  Avatar,
  Card,
  Paragraph,
  Button,
  Snackbar,
  FAB,
} from "react-native-paper";
import React from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";

import { setItemAsync, getItemAsync } from "../../utils/react/DataStore";

import { SliderBox } from "react-native-image-slider-box";

import { NativeModules } from "react-native";

import { THEME_OBJECT } from "../../utils/react/ThemeModule";

import moment from "moment/min/moment-with-locales";

module.exports = class SeeAd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      ad: {
        title: "",
        description: "",
        categoryId: "",
        price: "",
        images: [],
        isNegotiable: false,
        region: "",
      },
      formatter: null,
      isFavorite: false,
      snackbarVisible: false,
    };

    this.setFavorite = this.setFavorite.bind(this);
  }

  async componentDidMount() {
    this.setState({ ad: this.props.route.params.ad });
    moment.locale(NativeModules.I18nManager.localeIdentifier);
    const formatter = new Intl.NumberFormat(
      NativeModules.I18nManager.localeIdentifier.replace("_", "-"),
      {
        style: "currency",
        currency: "EUR",
      }
    );
    this.setState({ formatter });

    const favorites = await getItemAsync("favorites");
    if (favorites) {
      this.setState({
        isFavorite: favorites.includes(this.props.route.params.ad.id),
      });
    }
  }

  async setFavorite() {
    const favorites = (await getItemAsync("favorites", true)) || [];

    if (this.state.isFavorite) {
      favorites.splice(favorites.indexOf(this.props.route.params.ad.id), 1);
    } else {
      favorites.push(this.props.route.params.ad.id);
    }

    await setItemAsync("favorites", JSON.stringify(favorites));
    this.setState({
      isFavorite: !this.state.isFavorite,
      snackbarVisible: true,
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {this.state.ad?.images.length > 0 ? (
            <SliderBox
              images={this.state.ad?.images.map(
                (image) =>
                  `https://cdn.selyt.pt/ads/${this.state.ad?.id}/${image}.jpg`
              )}
              dotColor={THEME_OBJECT.colors.customSelectionColor}
              parentWidth={Dimensions.get("window").width}
            />
          ) : (
            <View style={styles.tinyLogo} />
          )}
          <Card>
            <FAB
              style={styles.fab}
              small
              icon={this.state.isFavorite ? "heart" : "heart-outline"}
              onPress={this.setFavorite}
            />
            <Card.Title
              title={this.state.ad?.title}
              subtitle={this.state.formatter?.format(this.state.ad?.price)}
            />
            <Card.Content>
              <Paragraph>{this.state.ad?.description}</Paragraph>
            </Card.Content>
          </Card>
        </View>
        <Snackbar
          visible={this.state.snackbarVisible}
          onDismiss={() => this.setState({ snackbarVisible: false })}
          action={{
            label: "Desfazer",
            onPress: () => {
              this.setFavorite();
              this.setState({ snackbarVisible: false });
            },
          }}
        >
          {this.state.isFavorite
            ? "Anúncio adicionado aos favoritos"
            : "Anúncio removido dos favoritos"}
        </Snackbar>
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
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
