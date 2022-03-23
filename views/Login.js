import {
  TextInput,
  Button,
  Portal,
  Dialog,
  Paragraph,
  ActivityIndicator,
  HelperText,
} from "react-native-paper";
import React from "react";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { login } from "../utils/LoginUtils";

import { getAndStoreUserData } from "../utils/react/DataStore";

import { IS_DARK_THEME, THEME_OBJECT } from "../utils/react/ThemeModule";

import * as Linking from "expo-linking";

module.exports = class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      hidePassword: true,
      showLoading: false,
      loadingMessage: "",
      showError: false,
      errorMessage: "",
      emailError: false,
      passwordError: false,
      canLogin: true,
    };

    this.login = this.login.bind(this);
  }

  async login() {
    // Verifications
    if (this.state.email.length == 0) {
      await this.setState({ emailError: true, canLogin: false });
    } else {
      await this.setState({ emailError: false });
    }

    if (this.state.password.length == 0) {
      await this.setState({ passwordError: true, canLogin: false });
    } else {
      await this.setState({ passwordError: false });
    }

    if (this.state.email.length > 0 && this.state.password.length > 0) {
      await this.setState({ canLogin: true });
    }

    if (this.state.canLogin) {
      await this.setState({
        showLoading: true,
        loadingMessage: "A autenticar...",
      });

      try {
        const { authorization } = await login(
          this.state.email,
          this.state.password
        );
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
              Login
            </Text>

            <Text>&nbsp;</Text>

            <TextInput
              label="Email"
              value={this.state.email}
              style={styles.textInput}
              selectionColor={THEME_OBJECT.colors.customSelectionColor}
              underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
              activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
              onChangeText={(text) => this.setState({ email: text })}
              keyboardType="email-address"
              left={<TextInput.Icon name="email" />}
            />
            <HelperText type="error" visible={this.state.emailError}>
              Erro: Email inválido.
            </HelperText>

            <TextInput
              label="Palavra-passe"
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
                  name={this.state.hidePassword ? "eye-off" : "eye"}
                  onPress={() =>
                    this.setState({ hidePassword: !this.state.hidePassword })
                  }
                />
              }
            />
            <HelperText type="error" visible={this.state.passwordError}>
              Erro: Palavra-passe inválida.
            </HelperText>

            <Text>&nbsp;</Text>

            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL(
                  "https://personal-95ufgxph.outsystemscloud.com/PasswordRecovery/"
                )
              }
            >
              Esqueci-me da palavra-passe
            </Text>

            <Text>&nbsp;</Text>

            <Text style={styles.text}>
              Ao entrar na plataforma Selyt, concorda com os{" "}
              <Text style={styles.link}>termos de uso</Text> e a{" "}
              <Text style={styles.link}>política de privacidade</Text> da
              plataforma.
            </Text>
            <Text>&nbsp;</Text>
            <Button mode="contained" dark={IS_DARK_THEME} onPress={this.login}>
              Entrar
            </Button>
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
                <Dialog.Title>Não foi possível autenticar.</Dialog.Title>
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
    color: THEME_OBJECT.colors.text,
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
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
