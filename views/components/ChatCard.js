import { NativeModules, Image } from "react-native";
import { Card, Text } from "react-native-paper";
import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { THEME_OBJECT } from "../../utils/react/ThemeModule";

import { getUserData } from "../../utils/react/DataStore";

import * as RootNavigation from "../../utils/react/RootNavigation.js";

import moment from "moment/min/moment-with-locales";
import "moment/locale/en-gb";
import "moment/locale/pt";

module.exports = class ChatCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      self: {},
    };

    this.props = props;

    this.onPress = this.onPress.bind(this);

    moment.locale(
      NativeModules.I18nManager.localeIdentifier.replace(/_[a-zA-Z]*/g, "")
    );
  }

  onPress() {
    RootNavigation.navigate("Chat", {
      payload: "join",
      id: this.props.chat.id,
    });
  }

  async componentDidMount() {
    await getUserData().then((user) => {
      this.setState({ self: user });
    });
  }

  render() {
    return (
      <Pressable onPress={this.onPress} style={styles.container}>
        <Card>
          <Card.Content style={styles.fixToText}>
            <View style={styles.row}>
              {this.props.chat.ad.images ? (
                <Image
                  style={styles.image}
                  source={{
                    uri: `https://cdn.selyt.pt/ads/${this.props.chat.ad.id}/${this.props.chat.ad.images[0]}.jpg`,
                  }}
                />
              ) : (
                <Image
                  style={styles.image}
                  source={{
                    uri: "https://cdn.selyt.pt/ads/default.jpg",
                  }}
                />
              )}
              <View>
                <Text style={styles.name}>{this.props.chat.ad?.title}</Text>
                <Text style={styles.marginText}>
                  Conversa com{" "}
                  {this.props.chat.senderId === this.state.self?.id
                    ? this.props.chat.receiver.name
                    : this.props.chat.sender.name}
                </Text>
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
    justifyContent: "center",
    width: "100%",
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    margin: 8,
    justifyContent: "space-between",
  },
  name: {
    marginLeft: 8,
    fontSize: 24,
    color: THEME_OBJECT.colors.text,
  },
  marginText: {
    marginLeft: 8,
    fontSize: 12,
    color: THEME_OBJECT.colors.text,
  },
  container2: {
    width: "100%",
  },
  image: {
    width: 50,
    height: 50,
  },
});
