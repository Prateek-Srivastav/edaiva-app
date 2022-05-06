import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { WebView } from "react-native-webview";
import { Feather } from "@expo/vector-icons";

import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../components/forms";
import authApi from "../api/auth";
import Colors from "../constants/Colors";
import useApi from "../hooks/useApi";
import CustomAlert from "../components/CustomAlert";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import cache from "../utilities/cache";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().min(2).label("First Name"),
  lastname: Yup.string().required().min(2).label("Last Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string()
    .required()
    .matches(
      /^(?=.*[A-Z])(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/,
      "Password must contain an uppercase letter, a lowercase letter, a number, and a special character."
    )
    .label("Password"),
});

function RegisterScreen({ navigation }) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [registerFailed, setRegisterFailed] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState();
  const [linkedinToken, setLinkedInToken] = useState();
  const [ldAuthStart, setLdAuthStarted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  WebBrowser.maybeCompleteAuthSession();

  const {
    data,
    error,
    request: getLinkedinLoginUrl,
  } = useApi(authApi.getLinkedinLogin);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "652348070444-7hrspqv4j9l2k3fq0gunp7dvjfa87hd4.apps.googleusercontent.com",
    expoClientId:
      "652348070444-91kal7v5edkh5h1bq75t84qpetp1ko3u.apps.googleusercontent.com",
  });

  const authContext = useContext(AuthContext);

  const handleGoogleAuth = async (authentication) => {
    setLoading(true);
    const result = await authApi.googleLogin(authentication.accessToken);
    if (!result.ok) {
      setLoading(false);

      setErrorMessage(result.data.detail);
      Toast.show({
        type: "appError",
        text1: result.data.detail
          ? result.data.detail
          : "Something went wrong!",
      });

      return setLoginFailed(true);
    }
    setLoading(false);
    setLoginFailed(false);

    const { access, refresh, email_verified, user } = result.data;

    if (!email_verified)
      return navigation.navigate("CodeVerification", { email: user.email });

    authContext.setTokens({ access, refresh });
    authStorage.storeToken(access, refresh);
    await cache.store("user", user);
  };

  const modifyRedirectUrl = async (data) => {
    setLoading(true);
    let redirectUrl = data.redirect_url;

    redirectUrl = redirectUrl.split("&");
    redirectUrl.splice(2, 1);
    const appRedirectUri = "https://auth.expo.io/@prateeksri/edaivajobsApp";
    // appRedirectUri = appRedirectUri.slice(1);
    redirectUrl.push(`redirect_uri=${appRedirectUri}`);
    redirectUrl = redirectUrl.join("&");
    setRedirectUrl(redirectUrl);
    setVisible(true);
    setLdAuthStarted(true);
    // const result = await WebBrowser.openAuthSessionAsync(redirectUrl);
    // // console.log(result);
  };

  const loadStart = ({ url }) => {
    if (!url) {
      return;
    }
    // // console.log(url);

    // The browser has redirected to our url of choice, the url would look like:
    // http://your.redirect.url?code=<access_token>&state=<anyauthstate-this-is-optional>
    const redirect = "https://auth.expo.io/@prateeksri/edaivajobsApp";

    const urlSplit = url.split("?");

    if (urlSplit[0] === redirect) {
      // We have the correct URL, parse it out to get the token

      const handleLinkedinAuth = async (token) => {
        setLoading(true);
        setVisible(false);
        const result = await authApi.linkedinLogin(token);
        // console.log(result + "h");
        if (!result.ok) {
          setLoading(false);
          // console.log(result);
          setErrorMessage(result.data.detail);
          Toast.show({
            type: "appError",
            text1: result.data.detail
              ? result.data.detail
              : "Something went wrong!!!!",
          });

          setLdAuthStarted(false);
          return setLoginFailed(true);
        }
        setLoading(false);
        setLoginFailed(false);

        const { access, refresh, email_verified, user } = result.data;

        if (!email_verified) {
          setLdAuthStarted(false);
          return navigation.navigate("CodeVerification", { email: user.email });
        }

        authContext.setTokens({ access, refresh });
        authStorage.storeToken(access, refresh);
        await cache.store("user", user);
        setLdAuthStarted(false);
      };

      const obj = url.split("=");
      if (obj[1]) {
        setLinkedInToken({ code: obj[1] });
        setLdAuthStarted(false);
        handleLinkedinAuth(obj[1]);
      }
    }
  };

  const LinkedinAuth = () => (
    <CustomAlert
      visible={ldAuthStart && visible}
      modalStyle={{
        flex: 1,
        paddingHorizontal: 4,
        paddingVertical: 4,
        width: "90%",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setLdAuthStarted(false);
          setVisible(false);
          setLoading(false);
        }}
        style={{
          borderWidth: 1,
          margin: 3,
          borderColor: "#0AB4F14D",
          borderRadius: 3,
          alignSelf: "flex-end",
        }}
      >
        <Feather name="x" size={22} color={Colors.primary} />
      </TouchableOpacity>
      <WebView
        style={styles.wv}
        source={{ uri: redirectUrl }}
        javaScriptEnabled
        domStorageEnabled
        onNavigationStateChange={loadStart}
      />
    </CustomAlert>
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleAuth(authentication);
    }

    // const onBackPress = () => {
    //   if (visible) setVisible(false);
    //   return true;
    // };

    // BackHandler.addEventListener("hardwareBackPress", onBackPress);

    // console.log(response);
    // return () =>
    //   BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [response]);

  useEffect(() => {
    getLinkedinLoginUrl();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    const result = await authApi.register(values);
    if (!result.ok) {
      setLoading(false);
      setErrorMessage(result.data.email[0]);
      return setRegisterFailed(true);
    }
    setLoading(false);
    setRegisterFailed(false);
    navigation.navigate("CodeVerification", {
      email: values.email,
      password: values.password,
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.authContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Text style={styles.authText}>Welcome.</Text>
        </View>

        <AppForm
          initialValues={{
            firstname: "",
            lastname: "",
            email: "",
            password: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={errorMessage} visible={registerFailed} />
          <AppFormField
            name="firstname"
            label="First Name"
            keyboardType="default"
            autoCapitalize="words"
          />
          <AppFormField
            name="lastname"
            label="Last Name"
            keyboardType="default"
            autoCapitalize="words"
          />
          <AppFormField
            name="email"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppFormField
            name="password"
            label="Password"
            icon={isPasswordShown ? "ios-eye-off" : "ios-eye"}
            keyboardType="default"
            secureTextEntry={!isPasswordShown}
            autoCapitalize="none"
            onIconPress={() => setIsPasswordShown(!isPasswordShown)}
          />
          <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
            <Text style={styles.forgotPassText}>
              By clicking Sign Up, you agree to our{" "}
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  flex: 1,
                  fontFamily: "OpenSans-Regular",
                  color: Colors.primary,
                  fontSize: 12.8,
                }}
              >
                Terms of Use
              </Text>
            </TouchableOpacity>
            <Text style={styles.forgotPassText}> and our </Text>
            <TouchableOpacity>
              <Text
                style={{
                  flex: 1,
                  fontFamily: "OpenSans-Regular",
                  color: Colors.primary,
                  fontSize: 12.8,
                }}
              >
                Privacy Policy.
              </Text>
            </TouchableOpacity>
          </View>
          <SubmitButton title={loading ? "Loading..." : "Sign up"} />
        </AppForm>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <View style={styles.line} />
          <View>
            <Text
              style={{
                fontSize: 14,
                textAlign: "center",
                fontFamily: "OpenSans-Regular",
                color: "#817E7E",
                marginHorizontal: 7,
              }}
            >
              Sign up with
            </Text>
          </View>
          <View style={styles.line} />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.thirdPartyAuthContainer, marginEnd: 20 }}
            disabled={!request}
            onPress={() => promptAsync()}
          >
            <Image
              source={require("../assets/google.png")}
              style={{ height: 22, width: 22 }}
              resizeMode="contain"
            />
            <Text style={styles.thirdPartyAuthText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.thirdPartyAuthContainer}
            onPress={() => modifyRedirectUrl(data)}
          >
            <Image
              source={require("../assets/linkedin.png")}
              style={{ height: 22, width: 22 }}
              resizeMode="contain"
            />
            <Text style={styles.thirdPartyAuthText}>LinkedIn</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LinkedinAuth />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#F9FBFB",
    // backgroundColor: "white",
  },
  authContainer: {
    // width: "100%",
    // alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#F9FBFB",
    // flex: 1,
    // borderWidth: 1,
    // borderColor: "#ccc",
    // elevation: 1,
    // borderRadius: 4,
    padding: 20,
    // marginBottom: 50,
    // marginHorizontal: 10,
  },
  authText: {
    fontFamily: "OpenSans-Medium",
    // textAlign: "center",
    fontSize: 42,
    // margin: 10,
    // marginBottom: 15,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 15,
    color: "red",
  },
  thirdPartyAuthContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "white",
    elevation: 3,
    padding: 10,
    borderRadius: 4,
    padding: 5,
  },
  thirdPartyAuthText: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    color: Colors.primary,
    // opacity: 0.5,
    fontSize: 13,
    margin: 8,
  },
  line: {
    flex: 1,
    height: 0.6,
    backgroundColor: "#C8C8C8",
  },
  forgotPassText: {
    fontFamily: "OpenSans-Regular",
    color: "#817E7E",
    fontSize: 12.8,
    // textAlign: "right",
  },
  textInput: {
    backgroundColor: "white",
    marginVertical: 10,
    width: "100%",
  },
  button: {
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    // padding: 15,
    marginVertical: 30,

    borderRadius: 4,
    alignSelf: "center",
  },
});

export default RegisterScreen;
