import React from "react";
import { StyleSheet, StatusBar, View } from "react-native";

import { THEME_OBJECT } from "../../utils/react/ThemeModule";

import API from "../../utils/API";

import { GiftedChat, InputToolbar, Actions } from "react-native-gifted-chat";

import { getUserData } from "../../utils/react/DataStore";

import * as SecureStore from "expo-secure-store";

import * as ImagePicker from "expo-image-picker";

import Socket from "../../utils/Socket";
import { FAB, Title, Avatar } from "react-native-paper";

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
    this.uploadImage = this.uploadImage.bind(this);

    this.customActions = this.customActions.bind(this);
    this.customInputToolbar = this.customInputToolbar.bind(this);
  }

  /**
   * Custom Modules for stylizing
   */

  customActions(props) {
    return (
      <Actions
        {...props}
        containerStyle={{
          width: 44,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 4,
          marginRight: 4,
          marginBottom: 0,
        }}
        icon={() => <Avatar.Icon size={32} icon="plus" />}
        options={{
          "Escolher da galeria": () => {
            this.chooseFromGallery();
          },
          "Tirar Fotografia": () => {
            this.takePicture();
          },
          Cancelar: () => {
            console.log("Cancel");
          },
        }}
        optionTintColor={THEME_OBJECT.colors.customBackgroundColor}
      />
    );
  }

  customInputToolbar(props) {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
        }}
        textInputStyle={{
          color: THEME_OBJECT.colors.text,
        }}
      />
    );
  }

  async chooseFromGallery() {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        return alert("É necessária permissão para aceder à galeria.");
      } else {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
          base64: true,
        });

        if (!result.cancelled) {
          this.uploadImage(result.base64);
        }
      }
    }
  }

  async takePicture() {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        return alert("É necessária permissão para aceder à câmara.");
      } else {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
          base64: true,
        });

        if (!result.cancelled) {
          this.uploadImage(result.base64);
        }
      }
    }
  }

  async uploadImage(image) {
    const authorization = await SecureStore.getItemAsync("authorization");
    await API.uploadImage(this.state.chat.id, image, authorization).catch(
      (err) => console.log(err)
    );
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
        const image = chatMessage.message.match(/(^{)[a-zA-Z0-9]{32}(.jpg}$)/)
          ? `https://cdn.selyt.pt/inboxes/${id}/${chatMessage.message
              .replace("{", "")
              .replace("}", "")}`
          : null;

        return {
          _id: chatMessage.id,
          text: chatMessage.message.match(/(^{)[a-zA-Z0-9]{32}(.jpg}$)/)
            ? null
            : chatMessage.message,
          image,
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
          const image = chatMessage.message.match(/(^{)[a-zA-Z0-9]{32}(.jpg}$)/)
            ? `https://cdn.selyt.pt/inboxes/${id}/${chatMessage.message
                .replace("{", "")
                .replace("}", "")}`
            : null;

          return {
            _id: chatMessage.id,
            text: chatMessage.message.match(/(^{)[a-zA-Z0-9]{32}(.jpg}$)/)
              ? null
              : chatMessage.message,
            image,
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

    console.log(messages);

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
              icon="arrow-circle-left"
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
          alwaysShowSend
          scrollToBottom
          placeholder={"Escreva uma mensagem..."}
          onInputTextChanged={(text) => this.onInputTextChanged(text)}
          renderInputToolbar={(props) => this.customInputToolbar(props)}
          renderActions={(props) => this.customActions(props)}
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
