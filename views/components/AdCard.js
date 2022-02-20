import { NativeModules } from "react-native";
import { Caption, Subheading, Title } from "react-native-paper";
import React from "react";
import { StyleSheet, Image, View, Pressable } from "react-native";
import { THEME_OBJECT } from "../../utils/react/ThemeModule";

import * as RootNavigation from "../../utils/react/RootNavigation.js";

import moment from "moment/min/moment-with-locales";

module.exports = class AdCard extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    console.log(props);

    this.onPress = this.onPress.bind(this);

    moment.locale(NativeModules.I18nManager.localeIdentifier);
  }

  onPress() {
    RootNavigation.navigate("SeeAd", {
      ad: this.props.ad,
    });
  }

  render() {
    return (
      <Pressable onPress={this.onPress} style={styles.container}>
        {this.props.ad.images ? (
          <Image
            style={styles.image}
            source={{
              uri: `https://cdn.selyt.pt/ads/${this.props.ad.id}/${this.props.ad.images[0]}.jpg`,
            }}
          />
        ) : (
          <View style={styles.tinyLogo} />
        )}
        <Title>{this.props.ad.title}</Title>
        <Subheading>{this.props.ad.price} €</Subheading>

        <Caption>{this.props.ad.region}</Caption>
        <Caption>
          {moment(this.props.ad.createdAt).format("LLL").toString()}
        </Caption>
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
