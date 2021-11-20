import { Appbar } from 'react-native-paper'
import React from 'react'
import { StyleSheet } from 'react-native'

import * as RootNavigation from '../../utils/react/RootNavigation.js';

export default function Footer() {
  return (
    <Appbar style={styles.bottom}>
      <Appbar.Action
        icon="home"
        onPress={() => RootNavigation.navigate('Start')}
      />
      <Appbar.Action
        icon="cards-heart"
        onPress={() => console.log('Pressed Favorites')}
      />
      <Appbar.Action
        icon="plus-circle"
        onPress={() => console.log('Pressed Sell')}
      />
      <Appbar.Action
        icon="chat"
        onPress={() => console.log('Pressed Chat')}
      />
      <Appbar.Action
        icon="account"
        onPress={() => RootNavigation.navigate('Account')}
      />
    </Appbar>
  );
}

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between'
  }
})
