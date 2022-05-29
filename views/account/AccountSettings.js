import { Card, TextInput, Button, IconButton } from "react-native-paper";
import React from "react";
import { StyleSheet, Text, StatusBar, SafeAreaView } from "react-native";

import { NativeModules } from "react-native";
import * as SecureStore from "expo-secure-store";

import { getUserData, clearUserData } from "../../utils/react/DataStore";

import moment from "moment/min/moment-with-locales";
import 'moment/locale/en-gb';
import 'moment/locale/pt';

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API from "../../utils/API";

import { IS_DARK_THEME, THEME_OBJECT } from "../../utils/react/ThemeModule";

module.exports = class AccountSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _user: null, // Original user data
      user: null,
      password: null,
      newPassword: null,
      newPasswordConfirmation: null,
      hidePassword: true,
      hideNewPassword: true,
      hideNewPasswordConfirmation: true,
      hidePasswordIcon: "eye",
      hideNewPasswordIcon: "eye",
      hideNewPasswordConfirmationIcon: "eye",
    };

    this._save = this._save.bind(this);
    this.changeIcon = this.changeIcon.bind(this);
    this.changeNewIcon = this.changeNewIcon.bind(this);
    this.changeNewConfirmationIcon = this.changeNewConfirmationIcon.bind(this);
  }

  async componentDidMount() {
    moment.locale(NativeModules.I18nManager.localeIdentifier.replace(/_[a-zA-Z]*/g, ''));
    getUserData().then((user) => {
      this.setState({ user, _user: user });
    });
  }

  async _save() {
    // TODO: validate data & show proper alerts for stuff
    // TODO: check if password is correct
    try {
      const authorization = await SecureStore.getItemAsync("authorization");

      if (
        this.state.password !== null &&
        this.state.newPassword !== null &&
        this.state.newPasswordConfirmation !== null
      ) {
        // Change password
        await API.changePassword(authorization, {
          password: this.state.password,
          newPassword: this.state.newPassword,
          newPasswordConfirmation: this.state.newPasswordConfirmation,
        })
          .then((res) => res.json())
          .then(async (res) => {
            console.log(res);
            if (res.ok) {
              alert("Senha alterada com sucesso!");
              await clearUserData();
              this.props.navigation.navigate("Main");
            } else {
              alert("Erro ao alterar senha!");
            }
          })
          .catch((err) => {
            alert("Erro ao alterar senha!");
          });
      }

      if (this.state.user === this.state._user) {
        return;
      }

      await API.updateSelf(authorization, {
        name: this.state.user.name,
        email: this.state.user.email,
        nif: this.state.user.nif,
        phone: this.state.user.phone,
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res.ok) {
            await clearUserData();
            this.props.navigation.navigate("Main");
          } else {
            alert("Erro ao atualizar dados");
          }
        });
    } catch (error) {
      alert("Não foi possível atualizar os dados");
      console.log(error);
    }
  }

  async changeIcon() {
    this.setState({
      hidePassword: !this.state.hidePassword,
      hidePasswordIcon: this.state.hidePassword ? "eye-off" : "eye",
    });
  }

  async changeNewIcon() {
    this.setState({
      hideNewPassword: !this.state.hideNewPassword,
      hideNewPasswordIcon: this.state.hideNewPassword ? "eye-off" : "eye",
    });
  }

  async changeNewConfirmationIcon() {
    this.setState({
      hideNewPasswordConfirmation: !this.state.hideNewPasswordConfirmation,
      hideNewPasswordConfirmationIcon: this.state.hideNewPasswordConfirmation
        ? "eye-off"
        : "eye",
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
            <Card.Content style={styles.adCard}>
              <IconButton
                icon="arrow-left-circle"
                onPress={() => this.props.navigation.goBack()}
                color={THEME_OBJECT.colors.customSelectionColor}
                size={38}
              />
              <Text style={styles.logoText}>Definições</Text>
            </Card.Content>

            <Card.Content style={styles.card}>
              <Text>&nbsp;</Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content style={styles.card}>
              <TextInput
                label="Nome"
                value={this.state.user?.name}
                style={styles.textInput}
                selectionColor={THEME_OBJECT.colors.customSelectionColor}
                underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
                activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
                onChangeText={(text) =>
                  this.setState({ user: { ...this.state.user, name: text } })
                }
                left={<TextInput.Icon name="account" />}
                placeholder="João Santos"
              />
              <TextInput
                label="Email"
                value={this.state.user?.email}
                style={styles.textInput}
                selectionColor={THEME_OBJECT.colors.customSelectionColor}
                underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
                activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
                onChangeText={(text) =>
                  this.setState({ user: { ...this.state.user, email: text } })
                }
                keyboardType="email-address"
                left={<TextInput.Icon name="email" />}
                placeholder="joão.santos@selyt.pt"
              />
              <TextInput
                label="NIF"
                value={this.state.user?.nif.toString()}
                style={styles.textInput}
                selectionColor={THEME_OBJECT.colors.customSelectionColor}
                underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
                activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
                onChangeText={(text) =>
                  this.setState({ user: { ...this.state.user, nif: text } })
                }
                keyboardType="phone-pad"
                left={<TextInput.Icon name="card-account-details" />}
                placeholder="123 456 789"
              />
              <TextInput
                label="Número de Telemóvel"
                value={this.state.user?.phone.toString()}
                style={styles.textInput}
                selectionColor={THEME_OBJECT.colors.customSelectionColor}
                underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
                activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
                onChangeText={(text) =>
                  this.setState({ user: { ...this.state.user, phone: text } })
                }
                keyboardType="phone-pad"
                left={<TextInput.Icon name="card-account-phone" />}
                placeholder="912 345 678"
              />
              <TextInput
                label="Palavra-passe atual"
                value={this.state.password}
                style={styles.textInput}
                selectionColor={THEME_OBJECT.colors.customSelectionColor}
                underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
                activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
                onChangeText={(text) => this.setState({ password: text })}
                secureTextEntry={this.state.hidePassword}
                left={<TextInput.Icon name="form-textbox-password" />}
                right={
                  <TextInput.Icon
                    name={this.state.hidePasswordIcon}
                    onPress={() => this.changeIcon()}
                  />
                }
              />
              <TextInput
                label="Nova palavra-passe"
                value={this.state.newPassword}
                style={styles.textInput}
                selectionColor={THEME_OBJECT.colors.customSelectionColor}
                underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
                activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
                onChangeText={(text) => this.setState({ newPassword: text })}
                secureTextEntry={this.state.hideNewPassword}
                left={<TextInput.Icon name="form-textbox-password" />}
                right={
                  <TextInput.Icon
                    name={this.state.hideNewPasswordIcon}
                    onPress={() => this.changeNewIcon()}
                  />
                }
              />
              <TextInput
                label="Confirmar nova palavra-passe"
                value={this.state.newPasswordConfirmation}
                style={styles.textInput}
                selectionColor={THEME_OBJECT.colors.customSelectionColor}
                underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
                activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
                onChangeText={(text) =>
                  this.setState({ newPasswordConfirmation: text })
                }
                secureTextEntry={this.state.hideNewPasswordConfirmation}
                left={<TextInput.Icon name="form-textbox-password" />}
                right={
                  <TextInput.Icon
                    name={this.state.hideNewPasswordConfirmationIcon}
                    onPress={() => this.changeNewConfirmationIcon()}
                  />
                }
              />
              <Text>&nbsp;</Text>
              <Button
                mode="contained"
                dark={IS_DARK_THEME}
                onPress={() => this._save()}
              >
                Salvar
              </Button>
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
  },
  logout: {
    color: "#ff3b3b",
  },
  text: {
    color: THEME_OBJECT.colors.text,
  },
});
