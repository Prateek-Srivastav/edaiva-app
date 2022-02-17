import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";

import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../components/forms";
import authApi from "../api/auth";
import Colors from "../constants/Colors";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().min(2).label("First Name"),
  lastname: Yup.string().required().min(2).label("Last Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string()
    .required()
    .matches(
      /^[A-Z](?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/,
      "Password must contain an uppercase letter, an lowercase letter, a number, and a special character."
    )
    .label("Password"),
});

function RegisterScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [registerFailed, setRegisterFailed] = useState(false);
  const [loading, setLoading] = useState(false);

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
