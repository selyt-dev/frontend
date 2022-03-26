import {
  Card,
  Dialog,
  Paragraph,
  Button,
  Portal,
  ActivityIndicator,
  IconButton,
  TextInput,
  Switch,
  Divider,
  List,
} from "react-native-paper";
import React from "react";
import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";

import API from "../../utils/API";

import { THEME_OBJECT } from "../../utils/react/ThemeModule";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import * as SecureStore from "expo-secure-store";

module.exports = class SelectCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };

    this.selectCategory = this.selectCategory.bind(this);
  }

  async componentDidMount() {
    const authorization = await SecureStore.getItemAsync("authorization");
    const data = await API.getCategories(authorization).then((res) =>
      res.json()
    );
    this.setState({ categories: data.categories });
  }

  async selectCategory(category) {
    const { navigation } = this.props;
    const routes = navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2];

    navigation.navigate({
      name: prevRoute.name,
      params: { category },
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
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.logoText}>Escolha a Categoria</Text>
              <List.Section>
                {this.state.categories?.map((category) => (
                  <List.Item
                    key={category.id}
                    title={category.name}
                    onPress={() => this.selectCategory(category)}
                    left={() => <List.Icon icon={category.icon} />}
                    right={() => <List.Icon icon="chevron-right" />}
                  />
                ))}
              </List.Section>
            </Card.Content>
          </Card>
        </KeyboardAwareScrollView>
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
});
