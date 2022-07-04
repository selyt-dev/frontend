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
import DateTimePicker from "@react-native-community/datetimepicker";

import moment from "moment/min/moment-with-locales";
import "moment/locale/en-gb";
import "moment/locale/pt";

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

import Linking from "expo-linking";

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
      // Errors
      nameError: false,
      emailError: false,
      passwordError: false,
      passwordConfirmationError: false,
      birthDateError: false,
      nifError: false,
      phoneError: false,
      canRegister: false,
    };

    moment.locale(
      NativeModules.I18nManager.localeIdentifier.replace(/_[a-zA-Z]*/g, "")
    );
    this.handleDatePicked = this.handleDatePicked.bind(this);
    this.handleRegister = this.handleRegister.bind(this);

    this.openTermsOfService = this.openTermsOfService.bind(this);
    this.openPrivacyPolicy = this.openPrivacyPolicy.bind(this);
  }

  openTermsOfService() {
    return Linking.openURL("https://selyt.pt/terms-and-conditions");
  }

  openPrivacyPolicy() {
    return Linking.openURL("https://selyt.pt/privacy-policy");
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
    // Verifications
    if (this.state.user.name === "") {
      await this.setState({
        nameError: true,
        canRegister: false,
      });
    } else {
      await this.setState({
        nameError: false,
      });
    }

    if (this.state.user.email === "") {
      await this.setState({
        emailError: true,
        canRegister: false,
      });
    } else {
      await this.setState({
        emailError: false,
      });
    }

    if (this.state.user.password === "") {
      await this.setState({
        passwordError: true,
        canRegister: false,
        passwordErrorSpecific: "Erro: A palavra-passe não pode ser vazia.",
      });
    } else {
      if (this.state.user.password !== this.state.user.passwordConfirmation) {
        await this.setState({
          passwordError: true,
          passwordConfirmationError: true,
          passwordErrorSpecific: "Erro: As palavras-passe têm que coincidir.",
          passwordConfirmationErrorSpecific:
            "Erro: As palavras-passe têm que coincidir.",
          canRegister: false,
        });
      } else if (
        !new RegExp("^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$").test(
          this.state.user.password
        )
      ) {
        await this.setState({
          passwordError: true,
          passwordErrorSpecific:
            "Erro: A palavra-passe deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo especial.",
          canRegister: false,
        });
      } else {
        await this.setState({
          passwordError: false,
          passwordErrorSpecific: "",
        });
      }
    }

    if (this.state.passwordConfirmation === "") {
      await this.setState({
        passwordConfirmationError: true,
        canRegister: false,
        passwordConfirmationErrorSpecific:
          "Erro: A confirmação da palavra-passe não pode ser vazia.",
      });
    } else {
      if (this.state.user.password !== this.state.user.passwordConfirmation) {
        await this.setState({
          passwordError: true,
          passwordConfirmationError: true,
          passwordErrorSpecific: "Erro: As palavras-passe têm que coincidir.",
          passwordConfirmationErrorSpecific:
            "Erro: As palavras-passe têm que coincidir.",
          canRegister: false,
        });
      } else if (
        !new RegExp("^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$").test(
          this.state.user.passwordConfirmation
        )
      ) {
        await this.setState({
          passwordConfirmationError: true,
          passwordConfirmationErrorSpecific:
            "Erro: A palavra-passe deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo especial.",
          canRegister: false,
        });
      } else {
        await this.setState({
          passwordConfirmationError: false,
          passwordConfirmationErrorSpecific: "",
        });
      }
    }

    if (this.state.user.birthDate === "") {
      await this.setState({
        birthDateError: true,
        canRegister: false,
      });
    } else {
      await this.setState({
        birthDateError: false,
      });
    }

    if (this.state.user.nif === "") {
      await this.setState({
        nifError: true,
        canRegister: false,
      });
    } else {
      if (
        !new RegExp("/^[123]|45|5|7/.").test(
          this.state.user.nif.replace(/\D/g, "")
        )
      ) {
        await this.setState({
          nifError: true,
          canRegister: false,
        });
      } else {
        await this.setState({
          nifError: false,
        });
      }
    }

    if (this.state.user.phone === "") {
      await this.setState({
        phoneError: true,
        canRegister: false,
      });
    } else {
      if (
        !this.state.user.phone.replace(/\D/g, "").startsWith(9) &&
        this.state.user.phone.replace(/\D/g, "").length !== 9
      ) {
        await this.setState({
          phoneError: true,
          canRegister: false,
        });
      } else {
        await this.setState({
          phoneError: false,
        });
      }
    }

    if (
      !this.state.nameError &&
      !this.state.emailError &&
      !this.state.passwordError &&
      !this.state.passwordConfirmationError &&
      !this.state.birthDateError &&
      !this.state.nifError &&
      !this.state.phoneError
    ) {
      await this.setState({
        canRegister: true,
      });
    }

    if (this.state.canRegister) {
      this.setState({
        showLoading: true,
        loadingMessage: "A registar a sua conta...",
      });

      const { user } = this.state;

      try {
        await register({
          ...user,
          nif: parseInt(user.nif.replace(/\D/g, "")),
          phone: parseInt(user.phone.replace(/\D/g, "")),
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
              left={<TextInput.Icon name="user" />}
              placeholder="João Santos"
              onFocus={() => this.setState({ showDatePicker: false })}
            />
            <HelperText type="error" visible={this.state.nameError}>
              Erro: Nome inválido.
            </HelperText>

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
              left={<TextInput.Icon name="envelope" />}
              placeholder="joão.santos@selyt.pt"
              onFocus={() => this.setState({ showDatePicker: false })}
            />
            <HelperText type="error" visible={this.state.emailError}>
              Erro: Email inválido.
            </HelperText>

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
              left={<TextInput.Icon name="key" />}
              right={
                <TextInput.Icon
                  name={this.state.hidePassword ? "eye-slash" : "eye"}
                  onPress={() =>
                    this.setState({ hidePassword: !this.state.hidePassword })
                  }
                />
              }
              onFocus={() => this.setState({ showDatePicker: false })}
            />
            <HelperText type="error" visible={this.state.passwordError}>
              {this.state.passwordErrorSpecific}
            </HelperText>

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
              left={<TextInput.Icon name="key" />}
              right={
                <TextInput.Icon
                  name={
                    this.state.hidePasswordConfirmation ? "eye-slash" : "eye"
                  }
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
            <HelperText
              type="error"
              visible={this.state.passwordConfirmationError}
            >
              {this.state.passwordConfirmationErrorSpecific}
            </HelperText>

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
              left={<TextInput.Icon name="calendar" />}
            />
            <HelperText type="error" visible={this.state.birthDateError}>
              Erro: Data de nascimento inválida.
            </HelperText>

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
              left={<TextInput.Icon name="info" />}
              placeholder="123 456 789"
              render={(props) => (
                <MaskedTextInput {...props} mask="999 999 999" />
              )}
              onFocus={() => this.setState({ showDatePicker: false })}
            />
            <HelperText type="error" visible={this.state.nifError}>
              Erro: NIF inválido. Formato: 000 000 000
            </HelperText>

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
              left={<TextInput.Icon name="phone" />}
              placeholder="912 345 678"
              render={(props) => (
                <MaskedTextInput {...props} mask="999 999 999" />
              )}
              onFocus={() => this.setState({ showDatePicker: false })}
            />
            <HelperText type="error" visible={this.state.phoneError}>
              Erro: Número de telemóvel inválido. Formato: 000 000 000
            </HelperText>

            <Text style={styles.text}>
              Ao registar uma conta na plataforma Selyt, concorda com os{" "}
              <Text style={styles.link} onPress={this.openTermsOfService}>
                termos de uso
              </Text>{" "}
              e a{" "}
              <Text style={styles.link} onPress={this.openPrivacyPolicy}>
                política de privacidade
              </Text>{" "}
              da plataforma.
            </Text>
            <Text>&nbsp;</Text>
            <Button
              mode="contained"
              dark={IS_DARK_THEME}
              onPress={this.handleRegister}
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
  link: {
    color: "#00a0ff",
    textDecorationLine: "underline",
  },
});
