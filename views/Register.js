import { View } from 'react-native'
import { TextInput, Button, Portal, Dialog, Paragraph } from 'react-native-paper'
import React from 'react'
import { StyleSheet, Text, DatePickerAndroid } from 'react-native'
import { register } from '../utils/API'

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

  function _register() {
    const data = {
      name,
      email,
      password,
      passwordConfirmation,
      birthDate,
      nif,
      phone
    }

    register(data)
      .then(response => response.json())
      .then(res => {
        if (!res.ok) {
          setText(res.message)
          showDialog()
        } else {
          setText(res)
          showDialog()
        }
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  return (
    <View style={styles.container}>
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
    </View>
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
    margin: 15
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
