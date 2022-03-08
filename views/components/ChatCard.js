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
              <View>
                <Text style={styles.name}>{this.props.chat.ad?.title}</Text>
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
    // backgroundColor: THEME_OBJECT.colors.customLightBackgroundColor,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 7,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
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
