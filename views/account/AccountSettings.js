import { Card, TextInput, Button, Portal, Dialog } from "react-native-paper";
import React from "react";
import { StyleSheet, Text, StatusBar, SafeAreaView } from "react-native";

import { NativeModules } from "react-native";
import * as SecureStore from "expo-secure-store";

import { getUserData, clearUserData } from "../../utils/react/DataStore";

import moment from "moment/min/moment-with-locales";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API from "../../utils/API";

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
    moment.locale(NativeModules.I18nManager.localeIdentifier);
    getUserData().then((user) => {
      this.setState({ user, _user: user });
    });
  }

  async _save() {
    // TODO: validate data & show proper alerts for stuff
    // TODO: check if password is correct
    try {
      console.log(this.state.user === this.state._user);

      console.log(
        this.state.password !== null &&
          this.state.newPassword !== null &&
          this.state.newPasswordConfirmation !== null
      );

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
        iban: this.state.user.iban,
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
            <Card.Content style={styles.card}>
              <Text style={styles.logoText}>Definições</Text>
              <Text>&nbsp;</Text>
              <TextInput
                label="Nome"
                value={this.state.user?.name}
                style={styles.textInput}
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
                onChangeText={(text) =>
                  this.setState({ user: { ...this.state.user, phone: text } })
                }
                keyboardType="phone-pad"
                left={<TextInput.Icon name="card-account-phone" />}
                placeholder="912 345 678"
              />
              <TextInput
                label="IBAN"
                value={this.state.user?.iban}
                style={styles.textInput}
                onChangeText={(text) =>
                  this.setState({ user: { ...this.state.user, iban: text } })
                }
                left={<TextInput.Icon name="bank" />}
                placeholder="PT50 0011 2213 3456 7890 0002 3"
              />
              <TextInput
                label="Palavra-passe atual"
                value={this.state.password}
                style={styles.textInput}
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
                color="#333333"
                dark="true"
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
    backgroundColor: "#222",
    paddingTop: StatusBar.currentHeight,
  },
  avatarContainer: {
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    marginTop: 10,
    color: "#fff",
  },
  sub: {
    fontSize: 14,
    marginTop: 8,
    color: "#fff",
  },
  subtitle: {
    fontSize: 20,
    marginTop: 8,
    color: "#fff",
  },
  insideContainer: {
    flex: 1,
    color: "#fff",
    backgroundColor: "#222",
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
    color: "#fff",
    fontFamily: "CoolveticaRegular",
    fontSize: 35,
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
