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
      categories: [],
    };

    this.uploadImages = this.uploadImages.bind(this);
    this.createAd = this.createAd.bind(this);
  }

  async componentDidMount() {
    moment.locale(NativeModules.I18nManager.localeIdentifier);
    const formatter = new Intl.NumberFormat(
      NativeModules.I18nManager.localeIdentifier.replace("_", "-"),
      {
        style: "currency",
        currency: "EUR",
      }
    );
    this.setState({ formatter });
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
    console.log("Create ad");
    this.setState({ loadingVisible: true });
    // TODO: Validate form
    const { ad } = this.state;

    const _ad = { ...ad, images: this.state.imagesBase64 };

    const authorization = await SecureStore.getItemAsync("authorization");

    try {
      const response = await API.createAd(authorization, _ad);

      if (response.ok) {
        this.setState({ loadingVisible: false });
        alert("O seu anúncio foi criado com sucesso!");
        this.props.navigation.navigate("Start");
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

  render() {
    return <SafeAreaView style={styles.container}></SafeAreaView>;
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
