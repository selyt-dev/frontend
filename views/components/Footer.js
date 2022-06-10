import { Appbar } from "react-native-paper";
import React from "react";
import { StyleSheet } from "react-native";

import * as RootNavigation from "../../utils/react/RootNavigation.js";

export default function Footer() {
  return (
    <Appbar style={styles.bottom}>
      <Appbar.Action
        icon="home"
        onPress={() => RootNavigation.navigate("Start")}
      />
      <Appbar.Action
        icon="heart"
        onPress={() => RootNavigation.navigate("FavoriteAds")}
      />
      <Appbar.Action
        icon="plus-circle"
        onPress={() => RootNavigation.navigate("CreateAd")}
      />
      <Appbar.Action
        icon="comment"
        onPress={() => RootNavigation.navigate("ChatList")}
      />
      <Appbar.Action
        icon="user"
        onPress={() => RootNavigation.navigate("Account")}
      />
    </Appbar>
  );
}

const styles = StyleSheet.create({
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
  },
});
