import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { WebView } from "react-native-webview";
import { Feather } from "@expo/vector-icons";

import authApi from "../api/auth";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import cache from "../utilities/cache";
import Carousel from "../components/carousels/Carousel";
import Colors from "../constants/Colors";
import { carouselData } from "../dummyData.js/carouselData";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import useApi from "../hooks/useApi";
import CustomAlert from "../components/CustomAlert";
import Loading from "../components/Loading";
import showToast from "../components/ShowToast";

function WelcomeScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState();
  const [linkedinToken, setLinkedInToken] = useState();
  const [ldAuthStart, setLdAuthStarted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLinkedinAuthLoading, setIsLinkedinAuthLoading] = useState();

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
    // console.log(result);
  };

  const loadStart = ({ url }) => {
    if (!url) {
      return;
    }
    // console.log(url);

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
        console.log(result + "h");
        if (!result.ok) {
          setLoading(false);
          console.log(result);
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

    console.log(response);
    // return () =>
    //   BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [response]);

  useEffect(() => {
    getLinkedinLoginUrl();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      style={styles.container}
    >
      {/* {!linkedinToken && ldAuthStart ? (
        <View style={styles.wvContainer}></View>
      ) : ( */}
      <>
        <Carousel data={carouselData} />
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.4}
          style={{
            ...styles.button,
            backgroundColor: Colors.primary,
          }}
        >
          <Text
            style={{
              fontFamily: "OpenSans-SemiBold",
              fontSize: 16,
              color: "white",
              textAlign: "center",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            // marginBottom: 30,
            paddingHorizontal: 20,
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
              Continue with
            </Text>
          </View>
          <View style={styles.line} />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.thirdPartyAuthContainer, marginEnd: 20 }}
            disabled={!request}
            // onPress={() => promptAsync({ useProxy: true, redirectUri })}
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
      </>
      <LinkedinAuth />
      {/* )} */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FDFDFD",
    // paddingHorizontal: 20,
    // paddingVertical: 20,
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
  button: {
    width: "90%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    // padding: 15,
    marginVertical: 30,
    marginHorizontal: 20,

    borderRadius: 4,
    alignSelf: "center",
  },
  wvContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  wv: {
    // flex: 1,
    // width: 380,
    // height: 300,
    // marginVertical: 20,
    // borderWidth: 1,
    // borderColor: "#333",
  },
});

export default WelcomeScreen;
