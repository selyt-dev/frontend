import { Caption, Subheading, Title, Card, Text } from "react-native-paper";
import React from "react";
import { StyleSheet, Image, View, Pressable } from "react-native";
import { IS_DARK_THEME, THEME_OBJECT } from "../../utils/react/ThemeModule";

import moment from "moment/min/moment-with-locales";

module.exports = class TransactionCard extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  render() {
    return (
      <Card.Content style={styles.card}>
        <Title>{this.props.description}</Title>
        <Subheading style={styles[`${this.props.type}`]}>{`${this.props.type === "credit" ? "+" : "-"} ${this.props.amount}`}</Subheading>

        <Caption>{moment(this.props.createdAt).format('DD/MM/YYYY HH:mm')}</Caption>
      </Card.Content>
    );
  }
};

const styles = StyleSheet.create({
  credit: {
    color: "#A6F7C3",
  },
  debit: {
    color: "#F7A6A6",
  },
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
