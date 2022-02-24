import {
  Avatar,
  Card,
  Paragraph,
  Button,
  Snackbar,
  FAB,
  Text,
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

import API from "../../utils/API";

import * as SecureStore from "expo-secure-store";

import ImageView from "react-native-image-viewing";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
      galleryVisible: false,
      imageIndex: 0,
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

    const authorization = await SecureStore.getItemAsync("authorization");
    await API.addVisit(this.state.ad.id, authorization);

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
        <KeyboardAwareScrollView
          style={styles.insideContainer}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
        >
          {this.state.ad.images?.length > 0 ? (
            <ImageView
              images={this.state.ad?.images.map((image) => {
                return {
                  uri: `https://cdn.selyt.pt/ads/${this.state.ad?.id}/${image}.jpg`,
                };
              })}
              imageIndex={this.state.imageIndex}
              visible={this.state.galleryVisible}
              onRequestClose={() => this.setState({ galleryVisible: false })}
            />
          ) : null}

          {this.state.ad.images?.length > 0 ? (
            <SliderBox
              images={this.state.ad?.images.map(
                (image) =>
                  `https://cdn.selyt.pt/ads/${this.state.ad?.id}/${image}.jpg`
              )}
              dotColor={THEME_OBJECT.colors.customSelectionColor}
              parentWidth={Dimensions.get("window").width}
              onCurrentImagePressed={(index) =>
                this.setState({ imageIndex: index, galleryVisible: true })
              }
            />
          ) : (
            <SliderBox
              images={[
                "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg",
              ]}
              dotColor={THEME_OBJECT.colors.customSelectionColor}
              parentWidth={Dimensions.get("window").width}
            />
          )}

          <Card>
            <Card.Title
              title={this.state.ad?.title}
              subtitle={`${this.state.formatter?.format(
                this.state.ad?.price
              )} ${this.state.ad?.isNegotiable ? "(Negociável)" : ""}`}
              left={() => (
                <Avatar.Icon size={40} icon={this.state.ad?.Category?.icon} />
              )}
            />

            <FAB
              style={styles.fab}
              small
              icon={this.state.isFavorite ? "heart" : "heart-outline"}
              onPress={this.setFavorite}
            />
          </Card>

          <Text>&nbsp;</Text>

          <Card>
            <Card.Title title="Descrição" />
            <Card.Content>
              <Paragraph>{this.state.ad?.description}</Paragraph>
            </Card.Content>
          </Card>

          <Card>
            <Card.Title title="Região" />
            <Card.Content>
              <Paragraph>{this.state.ad?.region}</Paragraph>
            </Card.Content>
          </Card>

          <Card>
            <Card.Title title="Visitas" />
            <Card.Content>
              <Paragraph>{this.state.ad?.visits}</Paragraph>
            </Card.Content>
          </Card>

          <Text>&nbsp;</Text>

          <Card>
            <Card.Title title="Informações do Vendedor" />
            <Card.Content>
              <View style={styles.row}>
                {this.state.ad?.User?.hasAvatar ? (
                  <Avatar.Image
                    style={{ width: 100, height: 100 }}
                    size={100}
                    source={{
                      uri:
                        this.state.avatar ||
                        `https://s3.eu-west-3.amazonaws.com/cdn.selyt.pt/users/${this.state.user?.id}.jpg`,
                    }}
                  />
                ) : (
                  <Avatar.Icon size={100} icon="account" />
                )}
                <View>
                  <Text style={styles.name}>{this.state.ad?.User?.name}</Text>
                  <Text style={styles.marginText}>
                    Membro desde{" "}
                    {moment(this.state.ad?.User?.createdAt)
                      .format("MMMM YYYY")
                      .toString()}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.toBottom}>
            <Card.Content>
              <Button
                icon="android-messages"
                mode="contained"
                style={styles.button}
                onPress={() => console.log("Send Message")}
              >
                Contactar Vendedor
              </Button>
            </Card.Content>
          </Card>
        </KeyboardAwareScrollView>
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

        <FAB
          style={styles.fabBack}
          small
          icon="arrow-left-circle"
          onPress={() => this.props.navigation.goBack()}
        />
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
    marginTop: 20,
    color: THEME_OBJECT.colors.text,
    marginLeft: 10,
  },
  marginText: {
    marginLeft: 10,
    fontSize: 13,
  },
  fabBack: {
    position: "absolute",
    top: StatusBar.currentHeight + 10,
    left: 10,
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
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  toBottom: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  button: {
    marginTop: -15,
  },
});
