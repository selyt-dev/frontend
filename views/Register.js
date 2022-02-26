import {
  TextInput,
  Button,
  Portal,
  Dialog,
  Paragraph,
  ActivityIndicator,
} from "react-native-paper";

import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import moment from "moment/min/moment-with-locales";

import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  NativeModules,
} from "react-native";

import { register, login } from "../utils/LoginUtils";

import { MaskedTextInput } from "react-native-mask-text";

import { getAndStoreUserData } from "../utils/react/DataStore";

import { IS_DARK_THEME, THEME_OBJECT } from "../utils/react/ThemeModule";

module.exports = class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        birthDate: "",
        nif: "",
        phone: "",
      },
      showDatePicker: false,
      showLoading: false,
      loadingMessage: "",
      showError: false,
      errorMessage: "",
      hidePassword: true,
      hidePasswordConfirmation: true,
    };

    moment.locale(NativeModules.I18nManager.localeIdentifier);
    this.handleDatePicked = this.handleDatePicked.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  async handleDatePicked(event, date) {
    if (date) {
      this.setState({
        user: {
          ...this.state.user,
          birthDate: date,
        },
        showDatePicker: Platform.OS === "ios",
      });
    }
  }

  async handleRegister() {
    this.setState({
      showLoading: true,
      loadingMessage: "A registar a sua conta...",
    });

    const { user } = this.state;

    try {
      await register({
        ...user,
        nif: parseInt(nif.replace(/\D/g, "")),
        phone: parseInt(phone.replace(/\D/g, "")),
      });

      this.setState({
        loadingMessage: "Conta criada com sucesso! A autenticar...",
      });

      const { authorization } = await login(user.email, user.password);
      await getAndStoreUserData(authorization);
      this.setState({ showLoading: false });
      this.props.navigation.navigate("Start");
    } catch (error) {
      this.setState({
        showLoading: false,
        showError: true,
        errorMessage: error.message,
      });
    }
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.insideContainer}>
            <Text animation="fadeInUp" style={styles.logoText}>
              Registo
            </Text>

            <Text>&nbsp;</Text>

            <TextInput
              label="Nome"
              value={this.state.user.name}
              style={styles.textInput}
              selectionColor={THEME_OBJECT.colors.customSelectionColor}
              underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
              activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
              onChangeText={(text) =>
                this.setState({ user: { ...this.state.user, name: text } })
              }
              left={<TextInput.Icon name="account" />}
              placeholder="João Santos"
              onFocus={() => this.setState({ showDatePicker: false })}
            />
            <TextInput
              label="Email"
              value={this.state.user.email}
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
              onFocus={() => this.setState({ showDatePicker: false })}
            />
            <TextInput
              label="Palavra-passe"
              value={this.state.user.password}
              style={styles.textInput}
              selectionColor={THEME_OBJECT.colors.customSelectionColor}
              underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
              activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
              onChangeText={(text) =>
                this.setState({ user: { ...this.state.user, password: text } })
              }
              secureTextEntry={this.state.hidePassword}
              left={<TextInput.Icon name="form-textbox-password" />}
              right={
                <TextInput.Icon
                  name={this.state.hidePassword ? "eye-off" : "eye"}
                  onPress={() =>
                    this.setState({ hidePassword: !this.state.hidePassword })
                  }
                />
              }
              onFocus={() => this.setState({ showDatePicker: false })}
            />
            <TextInput
              label="Confirmação de palavra-passe"
              value={this.state.user.passwordConfirmation}
              style={styles.textInput}
              selectionColor={THEME_OBJECT.colors.customSelectionColor}
              underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
              activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
              onChangeText={(text) =>
                this.setState({
                  user: { ...this.state.user, passwordConfirmation: text },
                })
              }
              secureTextEntry={this.state.hidePasswordConfirmation}
              left={<TextInput.Icon name="form-textbox-password" />}
              right={
                <TextInput.Icon
                  name={this.state.hidePasswordConfirmation ? "eye-off" : "eye"}
                  onPress={() =>
                    this.setState({
                      hidePasswordConfirmation:
                        !this.state.hidePasswordConfirmation,
                    })
                  }
                />
              }
              onFocus={() => this.setState({ showDatePicker: false })}
            />
            <TextInput
              label="Data de Nascimento"
              value={
                this.state.user.birthDate
                  ? moment(this.state.user.birthDate).format("DD/MM/YYYY")
                  : ""
              }
              selectionColor={THEME_OBJECT.colors.customSelectionColor}
              underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
              activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
              style={styles.textInput}
              onFocus={() => {
                Keyboard.dismiss();
                this.setState({
                  user: {
                    ...this.state.user,
                    birthDate:
                      this.state.user.birthDate ||
                      moment().subtract(18, "years").toDate(),
                  },
                  showDatePicker: true,
                });
              }}
              left={<TextInput.Icon name="calendar-range" />}
            />

            <TextInput
              label="NIF"
              value={this.state.user.nif}
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
              render={(props) => (
                <MaskedTextInput {...props} mask="999 999 999" />
              )}
              onFocus={() => this.setState({ showDatePicker: false })}
            />
            <TextInput
              label="Número de Telemóvel"
              value={this.state.user.phone}
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
              render={(props) => (
                <MaskedTextInput {...props} mask="999 999 999" />
              )}
              onFocus={() => this.setState({ showDatePicker: false })}
            />
            <Text style={styles.text}>
              Ao registar uma conta na plataforma Selyt, concorda com os [termos
              de uso] e [política de privacidade] da plataforma.
            </Text>
            <Text>&nbsp;</Text>
            <Button
              mode="contained"
              dark={IS_DARK_THEME}
              onPress={this.register}
            >
              Registar
            </Button>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Portal>
              <Dialog visible={this.state.showLoading} dismissable={false}>
                <Dialog.Title>{this.state.loadingMessage}</Dialog.Title>
                <Dialog.Content>
                  <ActivityIndicator animating={this.state.showLoading} />
                </Dialog.Content>
              </Dialog>
            </Portal>
            <Portal>
              <Dialog
                visible={this.state.showError}
                onDismiss={() => this.setState({ showError: false })}
              >
                <Dialog.Title>Não foi possível criar a sua conta.</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>{this.state.errorMessage}</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    color={THEME_OBJECT.colors.text}
                    onPress={() => this.setState({ showError: false })}
                  >
                    Ok
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </ScrollView>
        </TouchableWithoutFeedback>
        {this.state.showDatePicker && (
          <DateTimePicker
            value={this.state.user.birthDate}
            maximumDate={moment().subtract(18, "years").toDate()}
            mode="date"
            display="default"
            onChange={this.handleDatePicked}
            onCancel={() => this.setState({ showDatePicker: false })}
            textColor="#fff"
            style={{ flex: 1 }}
            themeVariant={THEME_OBJECT.dark ? "dark" : "light"}
          />
        )}
      </KeyboardAvoidingView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#fff",
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
    justifyContent: "center",
  },
  insideContainer: {
    flex: 1,
    color: "#fff",
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
    padding: 26,
    marginTop: 16,
    flex: 1,
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
  },
  textInput: {
    marginBottom: 7,
  },
  text: {
    color: THEME_OBJECT.colors.text,
  },
});
