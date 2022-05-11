import React, { useContext, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Formik } from "formik";
import Toast from "react-native-toast-message";

import AppText from "../components/AppText";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import cache from "../utilities/cache";
import CustomButton from "../components/CustomButton";
import Colors from "../constants/Colors";
import authApi from "../api/auth";

const CustomInput = React.forwardRef((props, ref) => {
  const [borderColor, setBorderColor] = useState("#E1E1E1");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");

  const inputChange = (text) => {
    if (!isNaN(parseInt(text))) {
      setBackgroundColor(Colors.cardBlue);
      setBorderColor(Colors.primary);
    } else {
      setBackgroundColor("#FFFFFF");
      setBorderColor("#E1E1E1");
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        // borderWidth: 1,
        borderRadius: 4,
        borderColor,
        // flex: 1,
        width: 50,
        height: 50,
        paddingHorizontal: 19,
        backgroundColor,
        // marginHorizontal: 10,
      }}
    >
      <TextInput
        {...props}
        style={{
          color: Colors.black,
          width: 30,
          fontSize: 20,
          textAlign: "center",
          fontFamily: "OpenSans-SemiBold",
        }}
        maxLength={1}
        keyboardType="numeric"
        selectTextOnFocus
        ref={ref}
      />
    </View>
  );
});

function VerificationCodeScreen({ navigation, route }) {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendOtp, setResendOtpFailed] = useState(false);
  const [verifyOtp, setVerifyOtpFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);

  const dig1_input = useRef();
  const dig2_input = useRef();
  const dig3_input = useRef();
  const dig4_input = useRef();
  const dig5_input = useRef();
  const dig6_input = useRef();

  const authContext = useContext(AuthContext);

  const resendOtpHandler = async () => {
    setLoading(true);
    const result = await authApi.resendOtp(route.params.email);
    if (!result.ok) {
      // console.log(result.data);
      return setResendOtpFailed(true);
    }
    setResendOtpFailed(false);
    Toast.show({
      type: "appSuccess",
      text1: "Otp Sent!",
    });
    // console.log(result.data);
  };

  const verificationHandler = async (values) => {
    const otp = `${values.dig1}${values.dig2}${values.dig3}${values.dig4}${values.dig5}${values.dig6}`;

    setLoading(true);
    const result = await authApi.verifyOtp({
      email: route.params.email,
      otp: otp,
    });

    if (!result.ok) {
      setLoading(false);

      Toast.show({
        type: "appError",
        text1: result.data.error,
      });
      return setVerifyOtpFailed(true);
    }

    setLoading(false);
    setVerifyOtpFailed(false);
    Toast.show({
      type: "appSuccess",
      text1: result.data.message,
    });

    if (navigation.getState().routes[0].name === "Welcome") {
      navigation.navigate("Login", {
        email: route.params.email,
        password: route.params.password,
      });
      const loginResult = await authApi.login(
        route.params.email,
        route.params.password
      );
      if (!loginResult.ok) {
        setLoading(false);

        setErrorMessage(loginResult.data.detail);
        // console.log(loginResult);
        return console.log("Login failed");
      }
      setLoading(false);
      setLoginFailed(false);
      const { access, refresh, email_verified, user } = loginResult.data;

      console.log(loginResult.data);
      if (!email_verified)
        return navigation.navigate("CodeVerification", email);

      authContext.setTokens({ access, refresh });
      authStorage.storeToken(access, refresh);
      await cache.store("user", user);
      // await cache.store("isProfileComplete", true);
      // await cache.store("isCampusStudent", false);
      return navigation.navigate("CampusSelection", { access, refresh });
    } else navigation.navigate("NewPassword");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.boldText}>VERIFICATION{"\n"}CODE</Text>
      <AppText style={{ color: Colors.black, marginTop: 15 }}>
        The One time Password is sent.
      </AppText>
      <TouchableOpacity onPress={resendOtpHandler}>
        <AppText
          style={{
            color: Colors.primary,
            fontFamily: "OpenSans-Italic",
            textDecorationLine: "underline",
            fontSize: 15,
          }}
        >
          Resend
        </AppText>
      </TouchableOpacity>
      <Formik
        initialValues={{ dig1: "", dig2: "", dig3: "", dig4: "", dig5: "" }}
        onSubmit={verificationHandler}
      >
        {({ setFieldTouched, handleChange, errors, touched, handleSubmit }) => (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 50,
                marginBottom: 10,
              }}
            >
              <CustomInput
                onChange={() => dig2_input.current.focus()}
                onChangeText={handleChange("dig1")}
                ref={dig1_input}
              />
              <CustomInput
                onChange={() => dig3_input.current.focus()}
                onChangeText={handleChange("dig2")}
                ref={dig2_input}
              />
              <CustomInput
                onChange={() => dig4_input.current.focus()}
                onChangeText={handleChange("dig3")}
                ref={dig3_input}
              />
              <CustomInput
                onChange={() => dig5_input.current.focus()}
                onChangeText={handleChange("dig4")}
                ref={dig4_input}
              />
              <CustomInput
                onChange={() => dig6_input.current.focus()}
                onChangeText={handleChange("dig5")}
                ref={dig5_input}
              />
              <CustomInput
                // onChange={() => dig2_input.current.focus()}
                onChangeText={handleChange("dig6")}
                ref={dig6_input}
              />
            </View>

            <CustomButton
              title="Verify"
              onPress={handleSubmit}
              style={{ flex: 0 }}
            />
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 45,
    color: Colors.black,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: Colors.bg,
    paddingVertical: 50,
  },
});

export default VerificationCodeScreen;
