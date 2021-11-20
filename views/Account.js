import { Avatar, Card } from 'react-native-paper'
import React, { useEffect } from 'react'
import { StyleSheet, Text, StatusBar, ScrollView, View, SafeAreaView, Pressable } from 'react-native'

import Footer from './components/Footer'
import { NativeModules } from 'react-native'

import moment from 'moment/min/moment-with-locales';

import AsyncStorage from '@react-native-async-storage/async-storage';

module.exports = class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null }
  }

  componentDidMount() {
    moment.locale(NativeModules.I18nManager.localeIdentifier)
    AsyncStorage.getItem('user').then((user) => {
      const userData = JSON.parse(user)
      this.setState({ user: userData })
    })
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.insideContainer}>
          <Card style={styles.card}>
            <Card.Content style={styles.adCard}>
              <View style={styles.avatarContainer}>
                {
                  this.state.user?.avatar ?
                    (<Avatar.Image size={100} source={{ uri: this.state.user?.avatar }} />) :
                    (<Avatar.Icon size={100} icon="account" />)
                }
                <Text style={styles.name}>{this.state.user?.name}</Text>
                <Text style={styles.sub}>Membro desde {moment(this.state.user?.createdAt).format('MMMM [de] YYYY').toString()}</Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
        <Footer />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#222',
    paddingTop: StatusBar.currentHeight
  },
  avatarContainer: {
    alignItems: 'center'
  },
  name: {
    fontSize: 24,
    marginTop: 10
  },
  sub: {
    fontSize: 14,
    marginTop: 8
  },
  insideContainer: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#222',
    paddingBottom: 56
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
  },
  adCard: {
    flex: 1,
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  }
})
