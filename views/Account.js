import { Avatar, Card } from "react-native-paper";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  View,
  SafeAreaView,
  Pressable,
  Image,
} from "react-native";

import Footer from "./components/Footer";
import { NativeModules } from "react-native";

import { getAndStoreUserData, getUserData } from "../utils/react/DataStore";

import moment from "moment/min/moment-with-locales";

import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import API from "../utils/API";

import * as SecureStore from "expo-secure-store";

module.exports = class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null, image: null };

    this.changeAvatar = this.changeAvatar.bind(this);
  }

  async componentDidMount() {
    moment.locale(NativeModules.I18nManager.localeIdentifier);
    getUserData().then((user) => {
      if (user.hasAvatar) {
        this.setState({ image: `https://s3.eu-west-3.amazonaws.com/cdn.selyt.pt/users/${user.id}.jpg` });
      }

      console.log(this.state.image)

      this.setState({ user });
    });
  }

  async changeAvatar() {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      } else {
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
          )

          const response = await data.json();

          if (response.ok) {
            this.setState({ image: `https://s3.eu-west-3.amazonaws.com/cdn.selyt.pt/users/${this.state.user?.id}.jpg` });
          } else {
            alert("Erro ao atualizar avatar");
          }
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
                      source={{ uri: `https://s3.eu-west-3.amazonaws.com/cdn.selyt.pt/users/${this.state.user?.id}.jpg` }}
                    />
                  ) : (
                    <Avatar.Icon size={100} icon="account" />
                  )}
                </Pressable>
                <Text style={styles.name}>{this.state.user?.name}</Text>
                <Text style={styles.sub}>
                  Membro desde{" "}
                  {moment(this.state.user?.createdAt)
                    .format("MMMM [de] YYYY")
                    .toString()}
                </Text>
              </View>
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
    backgroundColor: "#222",
    paddingTop: StatusBar.currentHeight,
  },
  avatarContainer: {
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    marginTop: 10,
  },
  sub: {
    fontSize: 14,
    marginTop: 8,
  },
  insideContainer: {
    flex: 1,
    color: "#fff",
    backgroundColor: "#222",
    paddingBottom: 56,
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
  },
  adCard: {
    flex: 1,
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});
