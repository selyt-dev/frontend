import {
  TextInput,
  Button,
  Portal,
  Dialog,
  Paragraph,
  ActivityIndicator,
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

export default function Login({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [hidePassword, setHidePassword] = React.useState(true);
  const [hidePasswordIcon, setHidePasswordIcon] = React.useState("eye");

  const [visible, setVisible] = React.useState(false);
  const [text, setText] = React.useState("");

  const [textLoading, setTextLoading] = React.useState("A autenticar...");
  const [visibleLoading, setVisibleLoading] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  function changeIcon() {
    setHidePassword(!hidePassword);
    setHidePasswordIcon(hidePassword ? "eye-off" : "eye");
  }

  async function _login() {
    setVisibleLoading(true);

    try {
      const { authorization } = await login(email, password);

      await getAndStoreUserData(authorization);

      setVisibleLoading(false);

      navigation.navigate("Start");
    } catch (error) {
      setVisibleLoading(false);
      setText(error.message);
      showDialog();
    }
  }

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
            value={email}
            style={styles.textInput}
            selectionColor={THEME_OBJECT.colors.customSelectionColor}
            underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
            activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            left={<TextInput.Icon name="email" />}
          />
          <TextInput
            label="Palavra-passe"
            value={password}
            style={styles.textInput}
            selectionColor={THEME_OBJECT.colors.customSelectionColor}
            underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
            activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={hidePassword}
            left={<TextInput.Icon name="form-textbox-password" />}
            right={
              <TextInput.Icon name={hidePasswordIcon} onPress={changeIcon} />
            }
          />

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
          <Button mode="contained" dark={IS_DARK_THEME} onPress={_login}>
            Entrar
          </Button>
          <Portal>
            <Dialog visible={visibleLoading} dismissable={false}>
              <Dialog.Title>{textLoading}</Dialog.Title>
              <Dialog.Content>
                <ActivityIndicator animating={visibleLoading} />
              </Dialog.Content>
            </Dialog>
          </Portal>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Não foi possível autenticar.</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{text}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button color={THEME_OBJECT.colors.text} onPress={hideDialog}>
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

/**
 * <DatePickerModal
          locale="pt-PT"
          mode="single"
          visible={open}
          onDismiss={onDismissSingle}
          date={birthDate}
          onConfirm={onConfirmSingle}
        
        />
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#fff",
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
    // alignItems: 'center',
    justifyContent: "center",
  },
  insideContainer: {
    flex: 1,
    color: THEME_OBJECT.colors.text,
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 26,
    marginTop: 16,
    flex: 1,
    // justifyContent: "space-around"
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
