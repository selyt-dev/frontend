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

module.exports = class EditAd extends React.Component {
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
        isActive: true,
        region: "",
      },
      imagesBase64: [],
      formatter: null,
      categoryUpdated: false,
      titleError: false,
      categoryError: false,
      descriptionError: false,
      locationError: false,
      priceError: false,
    };

    this.selectCategory = this.selectCategory.bind(this);
    this.uploadImages = this.uploadImages.bind(this);
    this.editAd = this.editAd.bind(this);
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

    const { route } = this.props;
    this.setState({ ad: route.params.ad, category: route.params.ad.Category });
  }

  async componentDidUpdate() {
    const { route } = this.props;

    if (route.params && route.params.category && !this.state.categoryUpdated) {
      this.setState({
        ad: { ...this.state.ad, categoryId: route.params.category.id },
        category: route.params.category,
        categoryUpdated: true,
      });
    }
  }

  async selectCategory() {
    this.setState({ categoryUpdated: false });
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

  async editAd() {
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

      const adObject = {
        title: _ad.title,
        description: _ad.description,
        categoryId: _ad.categoryId,
        price: _ad.price,
        isNegotiable: _ad.isNegotiable,
        isActive: _ad.isActive,
        region: _ad.region,
        images: _ad.images,
      };

      try {
        const response = await API.editAd(authorization, _ad.id, adObject).then(
          (res) => res.json()
        );

        if (response.ok) {
          this.setState({ loadingVisible: false });
          alert("O seu anúncio foi editado com sucesso!");
          this.props.navigation.navigate("SeeAd", { ad: response.ad });
        } else {
          this.setState({
            loadingVisible: false,
            errorVisible: true,
            errorMessage: response.message,
          });
        }
      } catch (error) {
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
              <Text style={styles.logoText}>Editar anúncio</Text>
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
                Erro: Categoria inválida.
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
              <HelperText type="error" visible={this.state.categoryError}>
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
              <HelperText type="error" visible={this.state.categoryError}>
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
                placeholder="30"
              />
              <HelperText type="error" visible={this.state.categoryError}>
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

              <View style={styles.setting}>
                <Text style={styles.textInput}>Anúncio ativo?</Text>
                <Switch
                  value={this.state.ad?.isActive}
                  onValueChange={(value) =>
                    this.setState({
                      ad: { ...this.state.ad, isActive: value },
                    })
                  }
                />
              </View>

              <Text>&nbsp;</Text>
              <Divider />
              <Text>&nbsp;</Text>

              <Text style={styles.subLogoText}>Imagens</Text>
              <Text>&nbsp;</Text>
              {this.state.ad?.images && this.state.ad?.images.length > 0 ? (
                <SliderBox
                  images={this.state.ad?.images.map((image) =>
                    image.startsWith("file:///")
                      ? image
                      : "https://cdn.selyt.pt/ads/" +
                        this.state.ad?.id +
                        "/" +
                        image +
                        ".jpg"
                  )}
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

              <Button
                mode="contained"
                dark={IS_DARK_THEME}
                onPress={() => this.setState({ postAdVisible: true })}
              >
                Editar Anúncio
              </Button>
            </Card.Content>
          </Card>
        </KeyboardAwareScrollView>

        <Portal>
          <Dialog visible={this.state.loadingVisible} dismissable={false}>
            <Dialog.Title>A editar anúncio...</Dialog.Title>
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
            <Dialog.Title>Não foi possível editar o anúncio.</Dialog.Title>
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
              <Paragraph>Tem a certeza que quer editar este anúncio?</Paragraph>
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
                  await this.editAd();
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
});
