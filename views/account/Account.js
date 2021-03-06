import {
  Avatar,
  Card,
  List,
  Dialog,
  Paragraph,
  Button,
  Portal,
  ActivityIndicator,
} from "react-native-paper";
import React from "react";
import {
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  View,
  SafeAreaView,
  Pressable,
} from "react-native";

import Footer from "../components/Footer";
import { NativeModules } from "react-native";

import { THEME_OBJECT } from "../../utils/react/ThemeModule";

import { getUserData } from "../../utils/react/DataStore";

import moment from "moment/min/moment-with-locales";
import "moment/locale/en-gb";
import "moment/locale/pt";

import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Linking from "expo-linking";

import API from "../../utils/API";

import * as SecureStore from "expo-secure-store";

import { clearUserData } from "../../utils/react/DataStore";

module.exports = class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      avatar: "",
      logoutVisible: false,
      loadingVisible: false,
      errorVisible: false,
      errorMessage: "",
      authorization: "",
    };

    this.changeAvatar = this.changeAvatar.bind(this);
  }

  async componentDidMount() {
    moment.locale(
      NativeModules.I18nManager.localeIdentifier.replace(/_[a-zA-Z]*/g, "")
    );
    const authorization = await SecureStore.getItemAsync("authorization");
    getUserData().then((user) => {
      this.setState({
        user,
        authorization,
        avatar: user.hasAvatar
          ? `https://cdn.selyt.pt/users/${user.id}.jpg?t=${Date.now()}`
          : "",
      });
    });
  }

  async changeAvatar() {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        this.setState({
          loadingVisible: false,
          errorVisible: true,
          errorMessage: "É necessária permissão para aceder à galeria.",
        });
        return;
      } else {
        this.setState({ loadingVisible: true });

        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.cancelled) {
          const image = await ImageManipulator.manipulateAsync(
            result.uri,
            [{ resize: { width: 128, height: 128 } }],
            {
              base64: true,
              compress: 0.7,
              format: ImageManipulator.SaveFormat.JPEG,
            }
          );

          const data = await API.updateAvatar(
            await SecureStore.getItemAsync("authorization"),
            `data:image/jpeg;base64,${image.base64}`
          );

          const response = await data.json();

          if (!response.ok) {
            this.setState({
              loadingVisible: false,
              errorVisible: true,
              errorMessage: response.message,
            });
          } else {
            getUserData().then((user) => {
              this.setState({
                loadingVisible: false,
                avatar: `https://cdn.selyt.pt/users/${
                  user.id
                }.jpg?t=${Date.now()}`,
                user,
              });
            });
          }
        } else {
          this.setState({ loadingVisible: false });
        }
      }
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.insideContainer}>
          <Card style={styles.card}>
            <Card.Content style={styles.adCard}>
              <View style={styles.avatarContainer}>
                <Pressable onPress={this.changeAvatar}>
                  {this.state.user?.hasAvatar ? (
                    <Avatar.Image
                      style={{ width: 100, height: 100 }}
                      size={100}
                      source={{
                        uri:
                          this.state.avatar ||
                          `https://cdn.selyt.pt/users/${
                            this.state.user?.id
                          }.jpg?t=${Date.now()}`,
                      }}
                    />
                  ) : (
                    <Avatar.Icon size={100} icon="user" />
                  )}
                </Pressable>
                <Text style={styles.name}>{this.state.user?.name}</Text>
                <Text style={styles.sub}>
                  Membro desde{" "}
                  {moment(this.state.user?.createdAt)
                    .format("MMMM YYYY")
                    .toString()}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Text>&nbsp;</Text>

          <Card style={styles.card}>
            <Card.Content style={styles.card}>
              <List.Section>
                <List.Subheader style={styles.subtitle}>
                  A sua conta
                </List.Subheader>
                <List.Item
                  title="Definições"
                  left={() => <List.Icon icon="cog" />}
                  onPress={() =>
                    this.props.navigation.navigate("AccountSettings")
                  }
                />
                <List.Item
                  title="Os seus anúncios"
                  left={() => <List.Icon icon="newspaper-o" />}
                  onPress={() => this.props.navigation.navigate("AccountAds")}
                />
                <List.Item
                  title="Suporte"
                  left={() => <List.Icon icon="question-circle" />}
                  onPress={() =>
                    Linking.openURL(
                      "https://personal-95ufgxph.outsystemscloud.com/SupportRequest/Create?Token=" +
                        this.state.authorization.replace("Basic ", "")
                    )
                  }
                />
                {this.state.user?.role === "admin" && (
                  <List.Item
                    title="Painel de Administração"
                    left={() => <List.Icon icon="lock" />}
                    onPress={() => Linking.openURL("https://admin.selyt.pt")}
                  />
                )}
                <List.Item
                  title="Sair"
                  titleStyle={styles.logout}
                  left={() => <List.Icon icon="sign-out" color="#ff3b3b" />}
                  onPress={() => this.setState({ logoutVisible: true })}
                />
              </List.Section>
            </Card.Content>
          </Card>
        </ScrollView>
        <Footer />
        <Portal>
          <Dialog visible={this.state.loadingVisible} dismissable={false}>
            <Dialog.Title>A atualizar avatar...</Dialog.Title>
            <Dialog.Content>
              <ActivityIndicator animating={this.state.loadingVisible} />
            </Dialog.Content>
          </Dialog>

          <Dialog
            visible={this.state.errorVisible}
            onDismiss={() => this.setState({ errorVisible: false })}
          >
            <Dialog.Title>Não foi possível atualizar o avatar.</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{this.state.errorMessage}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => this.setState({ errorVisible: false })}>
                Ok
              </Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog
            visible={this.state.logoutVisible}
            onDismiss={() => this.setState({ logoutVisible: false })}
          >
            <Dialog.Title>Alerta</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Tem a certeza que quer sair?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                color={THEME_OBJECT.colors.text}
                onPress={() => this.setState({ logoutVisible: false })}
              >
                Não
              </Button>
              <Button
                color={THEME_OBJECT.colors.text}
                onPress={async () => {
                  this.setState({ logoutVisible: false });
                  await clearUserData();
                  this.props.navigation.navigate("Main");
                }}
              >
                Sim
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
  avatarContainer: {
    alignItems: "center",
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
    fontFamily: "CoolveticaRegular",
    fontSize: 35,
  },
  textInput: {
    marginBottom: 7,
  },
  adCard: {
    flex: 1,
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    //    flexDirection: "row",
  },
  logout: {
    color: "#ff3b3b",
  },
});
