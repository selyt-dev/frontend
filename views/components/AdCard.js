import { Caption, Subheading, Title } from 'react-native-paper'
import React from 'react'
import { StyleSheet, Image, View, Pressable } from 'react-native'

module.exports = class AdCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Pressable
        onPress={this.props.onPress}
        style={styles.container}
      >
        <Image
          style={styles.tinyLogo}
          source={{ uri: this.props.image }}
        />
        <Title>{this.props.title}</Title>
        <Subheading>{this.props.price} €</Subheading>

        <Caption>{this.props.region}</Caption>
        <Caption>{this.props.createdAt}</Caption>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    width: '49%',
    marginBottom: 7
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
  tinyLogo: {
    width: 50,
    height: 50,
  }
})
