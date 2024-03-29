import {
  Card,
  Dialog,
  Paragraph,
  Button,
  Portal,
  ActivityIndicator,
  IconButton,
  TextInput,
  Switch,
  Divider,
  HelperText,
} from "react-native-paper";
import React from "react";
import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";

import API from "../../utils/API";

import { SliderBox } from "react-native-image-slider-box";

import { NativeModules } from "react-native";

import { THEME_OBJECT, IS_DARK_THEME } from "../../utils/react/ThemeModule";

import * as SecureStore from "expo-secure-store";

import * as ImagePicker from "expo-image-picker";

import moment from "moment/min/moment-with-locales";
import "moment/locale/en-gb";
import "moment/locale/pt";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Linking from "expo-linking";

module.exports = class CreateAd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      ad: {
        title: "",
        description: "",
        categoryId: "",
        price: "",
        images: [],
        isNegotiable: false,
        region: "",
      },
      imagesBase64: [],
      formatter: null,
      titleError: false,
      categoryError: false,
      descriptionError: false,
      locationError: false,
      priceError: false,
    };

    this.selectCategory = this.selectCategory.bind(this);
    this.uploadImages = this.uploadImages.bind(this);
    this.createAd = this.createAd.bind(this);

    this.openTermsOfService = this.openTermsOfService.bind(this);
  }

  openTermsOfService() {
    return Linking.openURL("https://selyt.pt/terms-and-conditions");
  }

  async componentDidMount() {
    moment.locale(
      NativeModules.I18nManager.localeIdentifier.replace(/_[a-zA-Z]*/g, "")
    );
    const formatter = new Intl.NumberFormat(
      NativeModules.I18nManager.localeIdentifier.replace("_", "-"),
      {
        style: "currency",
        currency: "EUR",
      }
    );
    this.setState({ formatter });
  }

  async componentDidUpdate() {
    const { route } = this.props;

    if (route.params && route.params.category && !this.state.category) {
      this.setState({
        ad: { ...this.state.ad, categoryId: route.params.category.id },
        category: route.params.category,
      });
    }
  }

  async selectCategory() {
    return this.props.navigation.navigate("SelectCategory");
  }

  async uploadImages() {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        this.setState({
          errorVisible: true,
          errorMessage: "É necessária permissão para aceder à galeria.",
        });
        return;
      } else {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
          base64: true,
        });

        if (!result.cancelled) {
          console.log(result);

          this.setState({
            ad: {
              ...this.state.ad,
              images: [...this.state.ad.images, result.uri],
            },
            imagesBase64: [
              ...this.state.imagesBase64,
              "data:image/jpeg;base64," + result.base64,
            ],
          });
          this.setState({ loadingVisible: false });
        }
      }
    }
  }

  async createAd() {
    this.setState({ loadingVisible: true });
    const { ad } = this.state;

    if (ad.title.length < 3 || ad.title.length > 70) {
      await this.setState({
        titleError: true,
        loadingVisible: false,
      });
    } else {
      await this.setState({ titleError: false });
    }

    if (!ad.categoryId) {
      await this.setState({
        categoryError: true,
        loadingVisible: false,
      });
    } else {
      await this.setState({ categoryError: false });
    }

    if (ad.description.length < 10 || ad.description.length > 2000) {
      await this.setState({
        descriptionError: true,
        loadingVisible: false,
      });
    } else {
      await this.setState({ descriptionError: false });
    }

    if (!ad.region) {
      await this.setState({
        locationError: true,
        loadingVisible: false,
      });
    } else {
      await this.setState({ locationError: false });
    }
    if (!ad.price) {
      await this.setState({
        priceError: true,
        loadingVisible: false,
      });
    } else {
      await this.setState({ priceError: false });
    }

    if (
      !this.state.titleError &&
      !this.state.categoryError &&
      !this.state.descriptionError &&
      !this.state.locationError &&
      !this.state.priceError
    ) {
      const _ad = { ...ad, images: this.state.imagesBase64 };

      const authorization = await SecureStore.getItemAsync("authorization");

      try {
        const response = await API.createAd(authorization, _ad).then((res) =>
          res.json()
        );

        if (response.ok) {
          this.setState({ loadingVisible: false });
          alert("O seu anúncio foi criado com sucesso!");
          this.props.navigation.navigate("SeeAd", { ad: response.ad });
        } else {
          this.setState({
            loadingVisible: false,
            errorVisible: true,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        console.log(error);
        this.setState({
          loadingVisible: false,
          errorVisible: true,
          errorMessage: error,
        });
      }
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          style={styles.insideContainer}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
        >
          <Card style={styles.card}>
            <Card.Content style={styles.adCard}>
              <IconButton
                icon="arrow-circle-left"
                onPress={() => this.props.navigation.goBack()}
                color={THEME_OBJECT.colors.customSelectionColor}
                size={38}
              />
              <Text style={styles.logoText}>Criar novo anúncio</Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Título *"
                value={this.state.ad?.title}
                style={styles.textInput}
                selectionColor={THEME_OBJECT.colors.customSelectionColor}
                underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
                activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
                onChangeText={(text) =>
                  this.setState({ ad: { ...this.state.ad, title: text } })
                }
                placeholder="p. ex. iPhone XS"
              />
              <HelperText type="info">
                {this.state.ad?.title.length}/70
              </HelperText>
              <HelperText type="error" visible={this.state.titleError}>
                Erro: Título inválido.
              </HelperText>

              <TextInput
                label="Categoria *"
                value={this.state.category?.name}
                disabled={true}
                style={styles.textInput}
                selectionColor={THEME_OBJECT.colors.customSelectionColor}
                underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
                activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
                onChangeText={(text) =>
                  this.setState({ ad: { ...this.state.ad, categoryId: text } })
                }
                placeholder="1"
              />

              <Button
                mode="contained"
                dark={IS_DARK_THEME}
                style={{ marginBottom: 10 }}
                onPress={this.selectCategory}
              >
                Selecionar Categoria
              </Button>

              <HelperText type="error" visible={this.state.categoryError}>
                Erro: Tem de selecionar uma categoria.
              </HelperText>

              <TextInput
                label="Descrição *"
                value={this.state.ad?.description}
                multiline={true}
                numberOfLines={6}
                style={styles.textInput}
                selectionColor={THEME_OBJECT.colors.customSelectionColor}
                underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
                activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
                onChangeText={(text) =>
                  this.setState({ ad: { ...this.state.ad, description: text } })
                }
                placeholder="Escreva uma breve descrição sobre o produto."
              />
              <HelperText type="info">
                {this.state.ad?.description.length}/2000
              </HelperText>
              <HelperText type="error" visible={this.state.descriptionError}>
                Erro: Descrição inválida.
              </HelperText>

              <TextInput
                label="Localização *"
                value={this.state.ad?.region}
                style={styles.textInput}
                selectionColor={THEME_OBJECT.colors.customSelectionColor}
                underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
                activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
                onChangeText={(text) =>
                  this.setState({ ad: { ...this.state.ad, region: text } })
                }
                placeholder="Sintra"
              />
              <HelperText type="error" visible={this.state.locationError}>
                Erro: Localização inválida.
              </HelperText>

              <TextInput
                label="Preço *"
                value={this.state.ad?.price}
                style={styles.textInput}
                selectionColor={THEME_OBJECT.colors.customSelectionColor}
                underlineColor={THEME_OBJECT.colors.customPartialSelectionColor}
                activeUnderlineColor={THEME_OBJECT.colors.customSelectionColor}
                onChangeText={(text) =>
                  this.setState({ ad: { ...this.state.ad, price: text } })
                }
                left={<TextInput.Affix text="€" />}
                keyboardType="numeric"
                placeholder="30"
              />
              <HelperText type="error" visible={this.state.priceError}>
                Erro: Preço inválido.
              </HelperText>

              <View style={styles.setting}>
                <Text style={styles.textInput}>Negociável?</Text>
                <Switch
                  value={this.state.ad?.isNegotiable}
                  onValueChange={(value) =>
                    this.setState({
                      ad: { ...this.state.ad, isNegotiable: value },
                    })
                  }
                />
              </View>

              <Text>&nbsp;</Text>
              <Divider />
              <Text>&nbsp;</Text>

              <Text style={styles.subLogoText}>Imagens</Text>
              <Text>&nbsp;</Text>
              {this.state.ad?.images.length > 0 ? (
                <SliderBox
                  images={this.state.ad?.images}
                  dotColor={THEME_OBJECT.colors.customSelectionColor}
                  parentWidth={Dimensions.get("window").width - 32}
                />
              ) : (
                <Text style={styles.text}>Nenhuma imagem carregada.</Text>
              )}
              <Text>&nbsp;</Text>
              <Button
                mode="contained"
                dark={IS_DARK_THEME}
                onPress={this.uploadImages}
              >
                Carregar Imagens
              </Button>

              <Text>&nbsp;</Text>
              <Divider />
              <Text>&nbsp;</Text>

              <Text style={styles.text}>
                Ao criar um anúncio na plataforma Selyt, concorda com os{" "}
                <Text style={styles.link} onPress={this.openTermsOfService}>
                  termos de uso
                </Text>{" "}
                da plataforma.
              </Text>
              <Text>&nbsp;</Text>
              <Button
                mode="contained"
                dark={IS_DARK_THEME}
                onPress={() => this.setState({ postAdVisible: true })}
              >
                Criar Anúncio
              </Button>
            </Card.Content>
          </Card>
        </KeyboardAwareScrollView>

        <Portal>
          <Dialog visible={this.state.loadingVisible} dismissable={false}>
            <Dialog.Title>A criar anúncio...</Dialog.Title>
            <Dialog.Content>
              <ActivityIndicator
                color={THEME_OBJECT.colors.text}
                animating={this.state.loadingVisible}
              />
            </Dialog.Content>
          </Dialog>

          <Dialog
            visible={this.state.errorVisible}
            onDismiss={() => this.setState({ errorVisible: false })}
          >
            <Dialog.Title>Não foi possível criar o anúncio.</Dialog.Title>
            <Dialog.Content>
              <Paragraph style={styles.text}>
                {this.state.errorMessage}
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                color={THEME_OBJECT.colors.text}
                onPress={() => this.setState({ errorVisible: false })}
              >
                Ok
              </Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog
            visible={this.state.postAdVisible}
            onDismiss={() => this.setState({ postAdVisible: false })}
          >
            <Dialog.Title>Alerta</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Tem a certeza que quer criar este anúncio?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                color={THEME_OBJECT.colors.text}
                onPress={() => this.setState({ postAdVisible: false })}
              >
                Não
              </Button>
              <Button
                color={THEME_OBJECT.colors.text}
                onPress={async () => {
                  this.setState({ postAdVisible: false });
                  await this.createAd();
                }}
              >
                Sim
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#fff",
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
    paddingTop: StatusBar.currentHeight,
  },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 24,
    marginTop: 10,
    color: THEME_OBJECT.colors.text,
  },
  sub: {
    fontSize: 14,
    marginTop: 8,
    color: THEME_OBJECT.colors.text,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 8,
    color: THEME_OBJECT.colors.text,
  },
  insideContainer: {
    flex: 1,
    color: THEME_OBJECT.colors.text,
    backgroundColor: THEME_OBJECT.colors.customBackgroundColor,
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
    fontFamily: "CoolveticaRegular",
    fontSize: 35,
    color: THEME_OBJECT.colors.text,
  },
  subLogoText: {
    fontFamily: "CoolveticaRegular",
    fontSize: 24,
    color: THEME_OBJECT.colors.text,
  },
  textInput: {
    marginBottom: 7,
    color: THEME_OBJECT.colors.text,
  },
  adCard: {
    flex: 1,
    //alignContent: "center",
    flexDirection: "row",
    alignItems: "baseline",
    //justifyContent: "center",
  },
  card: {
    flex: 1,
    //    flexDirection: "row",
  },
  logout: {
    color: "#ff3b3b",
  },
  text: {
    color: THEME_OBJECT.colors.text,
  },
  link: {
    color: "#00a0ff",
    textDecorationLine: "underline",
  },
});
