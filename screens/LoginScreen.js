import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";

import Colors from "../constants/Colors";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../components/forms";
import authApi from "../api/auth";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import cache from "../utilities/cache";
import useApi from "../hooks/useApi";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string()
    .required()
    .matches(
      /^(?=.*[A-Z])(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/,
      "Password must contain an uppercase letter, a lowercase letter, a number, and a special character."
    )
    .label("Password"),
});

function LoginScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    const result = await authApi.login(email, password);
    if (!result.ok) {
      setLoading(false);

      setErrorMessage(result.data.detail);
      console.log(result);
      return setLoginFailed(true);
    }
    setLoading(false);
    setLoginFailed(false);
    const { access, refresh, email_verified, user } = result.data;

    console.log(result.data);
    if (!email_verified) return navigation.navigate("CodeVerification", email);

    authContext.setTokens({ access, refresh });
    authStorage.storeToken(access, refresh);
    cache.store("user", user);
  };

  // const {
  //   data: googleLoginData,
  //   error,
  //   networkError,
  //   loading: googleLoginLoading,
  //   request: googleLogin,
  // } = useApi(authApi.googleLogin);

  // useEffect(() => googleLogin(), []);

  const handleGoogleLogin = async () => {
    // googleLogin();
    // console.log(googleLoginData.redirect_url);
    // const response = await fetch(googleLoginData.redirect_url);
    // console.log(response);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        // showsVerticalScrollIndicator={false}s
        contentContainerStyle={styles.authContainer}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 15,
          }}
        >
          <Text style={styles.authText}>Sign in</Text>
        </View>

        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={errorMessage} visible={loginFailed} />
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

          <TouchableOpacity
            style={{
              marginTop: -5,
              alignItems: "flex-start",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
            onPress={() => navigation.navigate("ForgotPasswordStack")}
          >
            <Text style={styles.forgotPassText}>Forgot Password?</Text>
          </TouchableOpacity>
          <SubmitButton title={loading ? "Loading..." : "Login"} />
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
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.thirdPartyAuthContainer, marginEnd: 20 }}
            onPress={handleGoogleLogin}
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
    flex: 1,
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
    // marginHorizontal: 10,
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
    fontSize: 13,
    // textAlign: "right",
  },
});

export default LoginScreen;
