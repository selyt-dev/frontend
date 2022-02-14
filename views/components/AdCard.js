import { NativeModules } from "react-native";
import { Caption, Subheading, Title } from "react-native-paper";
import React from "react";
import { StyleSheet, Image, View, Pressable } from "react-native";
import { THEME_OBJECT } from "../../utils/react/ThemeModule";

import moment from "moment/min/moment-with-locales";

module.exports = class AdCard extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    this.onPress = this.onPress.bind(this);

    moment.locale(NativeModules.I18nManager.localeIdentifier);
  }

  onPress() {
    console.log(this.props.id);
  }

  render() {
    return (
      <Pressable onPress={this.onPress} style={styles.container}>
        {this.props.image ? (
          <Image
            style={styles.image}
            source={{
              uri: `https://cdn.selyt.pt/ads/${this.props.id}/${this.props.image}.jpg`,
            }}
          />
        ) : (
          <View style={styles.tinyLogo} />
        )}
        <Title>{this.props.title}</Title>
        <Subheading>{this.props.price} €</Subheading>

        <Caption>{this.props.region}</Caption>
        <Caption>
          {moment(this.props.createdAt).format("LLL").toString()}
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
