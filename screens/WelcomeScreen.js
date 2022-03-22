import React, { useContext, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import authApi from "../api/auth";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import cache from "../utilities/cache";
import Carousel from "../components/carousels/Carousel";
import Colors from "../constants/Colors";
import { carouselData } from "../dummyData.js/carouselData";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import useApi from "../hooks/useApi";

function WelcomeScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  WebBrowser.maybeCompleteAuthSession();

  const {
    data,
    error,
    request: getLinkedinLoginUrl,
  } = useApi(authApi.getLinkedinLogin);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "652348070444-ugnvs7e9duc2b2sipm774gragfh4q4ag.apps.googleusercontent.com",
    expoClientId:
      "652348070444-91kal7v5edkh5h1bq75t84qpetp1ko3u.apps.googleusercontent.com",
    // redirectUri: AuthSession.makeRedirectUri({
    //   native:
    //     "com.googleusercontent.apps.652348070444-ugnvs7e9duc2b2sipm774gragfh4q4ag",
    //   useProxy: true,
    // }),
  });

  const authContext = useContext(AuthContext);

  // const redirectUri = AuthSession.makeRedirectUri({
  //   native: "com.jobs.edaiva",
  // });

  // console.log(redirectUri);

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

  const handleLinkedinAuth = async (data) => {
    setLoading(true);

    let redirectUrl = data.redirect_url;

    redirectUrl = redirectUrl.split("&");
    redirectUrl.splice(2, 1);
    const appRedirectUri = Linking.createURL();
    // appRedirectUri = appRedirectUri.slice(1);
    redirectUrl.push(`redirect_uri=${appRedirectUri}`);
    redirectUrl = redirectUrl.join("&");
    console.log(redirectUrl);

    // const result = await WebBrowser.openAuthSessionAsync(redirectUrl);

    // console.log(result);
  };

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleAuth(authentication);
    }
    if (data) handleLinkedinAuth(data);
    console.log(response);
  }, [response, data]);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      style={styles.container}
    >
      {/* <Image
        source={require("../assets/3918929.png")}
        style={{ height: 300, width: 300 }}
      /> */}
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
          onPress={() => getLinkedinLoginUrl()}
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
});

export default WelcomeScreen;
