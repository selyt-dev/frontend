import { View } from 'react-native'
import { TextInput, Button, Portal, Dialog, Paragraph, ActivityIndicator } from 'react-native-paper'
import React from 'react'
import { StyleSheet, Text, DatePickerAndroid, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { register, login } from '../utils/LoginUtils'

import * as SecureStore from 'expo-secure-store'

import { getAndStoreUserData } from '../utils/react/DataStore'

export default function Register({ navigation }) {
  const currentDate = new Date(0)

  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('')
  const [birthDate, setBirthDate] = React.useState(currentDate)
  const [nif, setNif] = React.useState('')
  const [phone, setPhone] = React.useState('')

  const [hidePassword, setHidePassword] = React.useState(true)
  const [hidePasswordConfirmation, setHidePasswordConfirmation] = React.useState(true)

  const [hidePasswordIcon, setHidePasswordIcon] = React.useState('eye')
  const [hidePasswordConfirmationIcon, setHidePasswordConfirmationIcon] = React.useState('eye')

  const [visible, setVisible] = React.useState(false);
  const [text, setText] = React.useState('');

  const [textLoading, setTextLoading] = React.useState('A criar conta...');
  const [visibleLoading, setVisibleLoading] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  function changeIcon() {
    setHidePassword(!hidePassword)
    setHidePasswordIcon(hidePassword ? 'eye-off' : 'eye')
  }

  function changeConfirmationIcon() {
    setHidePasswordConfirmation(!hidePasswordConfirmation)
    setHidePasswordConfirmationIcon(hidePasswordConfirmation ? 'eye-off' : 'eye')
  }

  async function _register() {
    setVisibleLoading(true)

    const data = {
      name,
      email,
      password,
      passwordConfirmation,
      birthDate,
      nif,
      phone
    }

    try {
      const { uid } = await register(data)
      console.log(uid)
      setTextLoading('Conta criada com sucesso! A autenticar...')

      await SecureStore.setItemAsync('uid', uid);

      const { authorization } = await login(email, password)
      console.log(authorization)

      await SecureStore.setItemAsync('authorization', authorization);
      await SecureStore.setItemAsync('isAuthenticated', "true");

      getAndStoreUserData(authorization)

      setVisibleLoading(false)

      navigation.navigate('Start')
    } catch (error) {
      setVisibleLoading(false)
      setText(error.message)
      showDialog()
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.insideContainer}>
          <Text animation='fadeInUp' style={styles.logoText}>
            Registo
          </Text>

          <Text>&nbsp;</Text>

          <TextInput
            label="Nome"
            value={name}
            style={styles.textInput}
            onChangeText={text => setName(text)}
            left={<TextInput.Icon name="account" />}
          />
          <TextInput
            label="Email"
            value={email}
            style={styles.textInput}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
            left={<TextInput.Icon name="email" />}
          />
          <TextInput
            label="Palavra-passe"
            value={password}
            style={styles.textInput}
            onChangeText={text => setPassword(text)}
            secureTextEntry={hidePassword}
            left={<TextInput.Icon name="form-textbox-password" />}
            right={<TextInput.Icon name={hidePasswordIcon} onPress={changeIcon} />}
          />
          <TextInput
            label="Confirmação de palavra-passe"
            value={passwordConfirmation}
            style={styles.textInput}
            onChangeText={text => setPasswordConfirmation(text)}
            secureTextEntry={hidePasswordConfirmation}
            left={<TextInput.Icon name="form-textbox-password" />}
            right={<TextInput.Icon name={hidePasswordConfirmationIcon} onPress={changeConfirmationIcon} />}
          />
          <TextInput
            label="Data de Nascimento"
            value={birthDate === currentDate ? '' : birthDate.toLocaleDateString()}
            style={styles.textInput}
            onFocus={async () => {
              try {
                const { action, year, month, day } = await DatePickerAndroid.open({ date: birthDate === currentDate ? Date.now() : birthDate, maxDate: Date.now() })
                if (action !== DatePickerAndroid.dismissedAction) {
                  setBirthDate(new Date(year, month, day))
                }
              } catch (e) {
                console.warn(e)
              }
            }}
            left={<TextInput.Icon name="calendar-range" />}
          />
          <TextInput
            label="NIF"
            value={nif}
            style={styles.textInput}
            onChangeText={text => setNif(text)}
            keyboardType="phone-pad"
            left={<TextInput.Icon name="card-account-details" />}
          />
          <TextInput
            label="Número de Telemóvel"
            value={phone}
            style={styles.textInput}
            onChangeText={text => setPhone(text)}
            keyboardType="phone-pad"
            left={<TextInput.Icon name="card-account-phone" />}
          />
          <Text>&nbsp;</Text>
          <Button
            mode='contained'
            color='#333333'
            dark='true'
            onPress={_register}
          >
            Registar
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
              <Dialog.Title>Não foi possível criar a sua conta.</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{text}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>Ok</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
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
    color: '#fff',
    backgroundColor: '#222',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  insideContainer: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#222',
    // alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    flex: 1,
    // justifyContent: "space-around"
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container2: {
    width: '100%'
  },
  image: {
    width: 150,
    height: 150
  },
  logoText: {
    color: '#fff',
    fontFamily: 'CoolveticaRegular',
    fontSize: 35
  },
  textInput: {
    marginBottom: 7
  }
})
