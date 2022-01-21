import { Card, TextInput, Button, Portal, Dialog } from "react-native-paper";
import React from "react";
import {
  StyleSheet,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";

import TransactionCard from "../components/TransactionCard";

import { NativeModules } from "react-native";
import * as SecureStore from "expo-secure-store";

import { getUserData, clearUserData } from "../../utils/react/DataStore";

import moment from "moment/min/moment-with-locales";

import API from "../../utils/API";

import { IS_DARK_THEME, THEME_OBJECT } from "../../utils/react/ThemeModule";

module.exports = class AccountBalance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      formatter: null,
      transactions: [],
    };

    this.withdraw = this.withdraw.bind(this);
  }

  async componentDidMount() {
    moment.locale(NativeModules.I18nManager.localeIdentifier);
    const formatter = new Intl.NumberFormat(
      NativeModules.I18nManager.localeIdentifier.replace("_", "-"),
      {
        style: "currency",
        currency: "EUR",
      }
    );
    getUserData().then(async (user) => {
      this.setState({ user, formatter });

      await API.getTransactions(await SecureStore.getItemAsync("authorization"))
        .then((res) => res.json())
        .then((res) => {
          if (res.ok) {
            this.setState({ transactions: res.transactions });
          }
        });
    });
  }

  async withdraw() {
    // TODO: everything :HAhaa:
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.insideContainer}>
          <Card style={styles.card}>
            <Card.Content style={styles.card}>
              <Text style={styles.logoText}>Saldo</Text>
              <Text>&nbsp;</Text>
              <Text style={styles.name}>
                {this.state.formatter?.format(this.state.user?.balance)}
              </Text>
            </Card.Content>
          </Card>

          <Text>&nbsp;</Text>

          <Card style={styles.card}>
            <Card.Content style={styles.card}>
              <Text style={styles.logoTextSmaller}>As suas transações</Text>
              <Text>&nbsp;</Text>

              {this.state.transactions.length > 0 ? (
                this.state.transactions?.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    createdAt={transaction.createdAt}
                    amount={this.state.formatter?.format(transaction.amount)}
                    description={transaction.description}
                    type={transaction.type}
                  />
                ))
              ) : (
                <Text style={styles.nameSmaller}>
                  Não existem transações a mostrar.
                </Text>
              )}
            </Card.Content>
          </Card>
        </ScrollView>
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
    textAlign: "center",
  },
  nameSmaller: {
    fontSize: 18,
    marginTop: 10,
    color: THEME_OBJECT.colors.text,
    textAlign: "center",
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
    color: THEME_OBJECT.colors.text,
    fontFamily: "CoolveticaRegular",
    fontSize: 35,
    textAlign: "center",
  },
  logoTextSmaller: {
    color: THEME_OBJECT.colors.text,
    fontFamily: "CoolveticaRegular",
    fontSize: 24,
    textAlign: "center",
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
