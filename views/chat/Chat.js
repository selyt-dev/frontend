import React from "react";
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView,
  View,
} from "react-native";

import { THEME_OBJECT } from "../../utils/react/ThemeModule";

import API from "../../utils/API";

import { GiftedChat, InputToolbar } from "react-native-gifted-chat";

import { getUserData } from "../../utils/react/DataStore";

import * as SecureStore from "expo-secure-store";

import Socket from "../../utils/Socket";
import { FAB, Title } from "react-native-paper";

/**
 * Custom Modules for stylizing
 */

const customInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
      }}
    />
  );
};

module.exports = class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      self: {},
      messages: [],
      chat: {},
      senderId: "",
      receiverId: "",
      isTyping: false,
      isLoadingEarlier: true,
      socket: null,
    };

    this.onInputTextChanged = this.onInputTextChanged.bind(this);
  }

  async componentDidMount() {
    const authorization = await SecureStore.getItemAsync("authorization");

    const { id } = this.props.route.params;

    getUserData().then((user) => {
      this.setState({ self: user });
    });

    const res = await API.getChat(id, authorization)
      .then((res) => res.json())
      .catch((err) => console.log(err));

    let gCM = [];

    if (res.messages) {
      gCM = res.messages.map((chatMessage) => {
        return {
          _id: chatMessage.id,
          text: chatMessage.message,
          createdAt: chatMessage.createdAt,
          user: {
            _id: chatMessage.sender.id,
            name: chatMessage.sender.name,
            avatar: chatMessage.sender.hasAvatar
              ? `https://cdn.selyt.pt/users/${chatMessage.sender.id}.jpg`
              : "https://cdn.selyt.pt/users/default.png",
          },
        };
      });
    }

    this.setState({
      chat: res.chat,
      messages: gCM,
      senderId: res.chat.senderId,
      receiverId: res.chat.receiverId,
      isLoadingEarlier: false,
    });

    this.socket = new Socket(API.BASE_URL, authorization, this.state.chat.id);

    this.socket.on("typing", (data) => {
      if (data.senderId !== this.state.self.id && data.isTyping) {
        this.setState({ isTyping: true });
      } else if (!data.isTyping) {
        this.setState({ isTyping: false });
      }
    });

    this.socket.on("message", async () => {
      const res = await API.getChat(id, authorization)
        .then((res) => res.json())
        .catch((err) => console.log(err));

      let gCM = [];

      if (res.messages) {
        gCM = res.messages.map((chatMessage) => {
          return {
            _id: chatMessage.id,
            text: chatMessage.message,
            createdAt: chatMessage.createdAt,
            user: {
              _id: chatMessage.sender.id,
              name: chatMessage.sender.name,
              avatar: chatMessage.sender.hasAvatar
                ? `https://cdn.selyt.pt/users/${chatMessage.sender.id}.jpg`
                : "https://cdn.selyt.pt/users/default.png",
            },
          };
        });
      }

      this.setState({
        messages: gCM,
      });
    });
  }

  async onInputTextChanged(text) {
    this.socket?.emit("typing", {
      id: this.state.chat.id,
      senderId: this.state.self?.id,
      isTyping: true,
    });
  }

  async onSend(messages = []) {
    const authorization = await SecureStore.getItemAsync("authorization");

    await API.sendMessage(this.state.chat?.id, messages[0].text, authorization);

    const _res = await API.getChat(this.state.chat?.id, authorization)
      .then((res) => res.json())
      .catch((err) => console.log(err));

    let gCM = [];

    if (_res.messages) {
      gCM = _res.messages.map((chatMessage) => {
        return {
          _id: chatMessage.id,
          text: chatMessage.message,
          createdAt: chatMessage.createdAt,
          user: {
            _id: chatMessage.sender.id,
            name: chatMessage.sender.name,
            avatar: chatMessage.sender.hasAvatar
              ? `https://cdn.selyt.pt/users/${chatMessage.sender.id}.jpg`
              : "https://cdn.selyt.pt/users/default.png",
          },
        };
      });
    }

    this.setState({
      messages: gCM,
    });

    this.socket?.emit("message", {
      id: this.state.chat.id,
    });

    this.socket?.emit("typing", {
      id: this.state.chat.id,
      senderId: this.state.self?.id,
      isTyping: false,
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.insideContainer}>
            <FAB
              style={styles.fabBack}
              small
              icon="arrow-left-circle"
              onPress={() => this.props.navigation.goBack()}
            />
            <Title style={styles.title}>
              {this.state.chat?.senderId === this.state.self?.id
                ? this.state.chat?.receiverId === this.state.self?.id
                  ? "Chat"
                  : this.state.chat?.receiver?.name
                : this.state.chat?.sender?.name}
            </Title>
          </View>
        </View>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.self?.id,
            name: this.state.self?.name,
            avatar: this.state.self?.hasAvatar
              ? `https://cdn.selyt.pt/users/${this.state.self?.id}.jpg`
              : "https://cdn.selyt.pt/users/default.png",
          }}
          isTyping={this.state.isTyping}
          isLoadingEarlier={this.state.isLoadingEarlier}
          inverted={false}
          alwaysShowSend={true}
          placeholder={"Escreva uma mensagem..."}
          onInputTextChanged={(text) => this.onInputTextChanged(text)}
          renderInputToolbar={(props) => customInputToolbar(props)}
          listViewProps={{
            style: {
              backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
              color: THEME_OBJECT.colors.text,
            },
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    color: "#fff",
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
    paddingTop: StatusBar.currentHeight,
  },
  insideContainer: {
    color: "#fff",
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
    height: 64,
    paddingLeft: 16,
    flexDirection: "row",
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
  title: {
    position: "absolute",
    marginTop: 14,
    marginLeft: 64,
  },
  fabBack: {
    position: "absolute",
    marginTop: 12,
    marginLeft: 12,
  },
  logoText: {
    color: "#fff",
    fontFamily: "CoolveticaRegular",
    fontSize: 35,
  },
  textInput: {
    marginBottom: 7,
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
  },
  adCard: {
    flex: 1,
    flexWrap: "wrap",
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    color: THEME_OBJECT.colors.text,
  },
});
