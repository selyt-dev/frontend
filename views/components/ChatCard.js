import { NativeModules } from "react-native";
import { Card, Avatar, Text } from "react-native-paper";
import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { THEME_OBJECT } from "../../utils/react/ThemeModule";

import * as RootNavigation from "../../utils/react/RootNavigation.js";

import moment from "moment/min/moment-with-locales";

module.exports = class ChatCard extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    this.onPress = this.onPress.bind(this);

    moment.locale(NativeModules.I18nManager.localeIdentifier);
  }

  onPress() {
    RootNavigation.navigate("SeeChat", {
      chat: this.props.chat,
    });
  }

  render() {
    return (
      <Pressable onPress={this.onPress} style={styles.container}>
        <Card>
          <Card.Content>
            <View style={styles.row}>
              {this.state.chat?.User?.hasAvatar ? (
                <Avatar.Image
                  style={{ width: 100, height: 100 }}
                  size={100}
                  source={{
                    uri:
                      this.state.avatar ||
                      `https://s3.eu-west-3.amazonaws.com/cdn.selyt.pt/users/${this.state.chat.User?.id}.jpg`,
                  }}
                />
              ) : (
                <Avatar.Icon size={100} icon="account" />
              )}
              <View>
                <Text style={styles.name}>{this.state.chat.User?.name}</Text>
                <Text style={styles.marginText}>Last Message</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Pressable>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME_OBJECT.colors.customLightBackgroundColor,
    alignItems: "center",
    justifyContent: "center",
    width: "49%",
    marginBottom: 7,
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
  tinyLogo: {
    width: 50,
    height: 50,
  },
});
