import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

import { AppForm, AppFormField, SubmitButton } from "../../components/forms";
import AppText from "../../components/AppText";
import Colors from "../../constants/Colors";
import CustomAlert from "../../components/CustomAlert";
import { Lock } from "../../assets/svg/icons";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import authApi from "../../api/auth";
import showToast from "../../components/ShowToast";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

function MainScreen({ navigation }) {
  const [email, setEmail] = useState();
  const [visible, setVisible] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Send");

  const {
    data,
    error,
    loading,
    networkError,
    request: sendOtp,
  } = useApi(authApi.forgotPassword);

  const submitHandler = async ({ email }) => {
    setEmail(email);
    await sendOtp(email);
    console.log(error);

    if (error) return showToast({ type: "appError", message: data.detail });

    setVisible(true);
    setButtonTitle("Resend");
    setTimeout(() => {
      setVisible(false);
      setShowTimer(true);
    }, 2000);
  };

  const LinkSentAlert = () => (
    <CustomAlert visible={visible}>
      <View
        style={{
          height: 80,
          width: 80,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.primary,
          alignSelf: "center",
        }}
      >
        <FontAwesome5
          name="check"
          size={40}
          color="black"
          style={{ elevation: 10 }}
        />
      </View>
      <Text style={styles.boldAlertText}>LINK SENT</Text>
      <AppText
        style={{ color: Colors.black, marginTop: 10, textAlign: "center" }}
      >
        Password reset link has been sent to {email}
      </AppText>
    </CustomAlert>
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: 50 }}
      style={styles.container}
    >
      <View style={{ marginStart: 30, marginBottom: 20 }}>
        <Lock />
      </View>
      <Text style={styles.boldText}>FORGOT{"\n"}PASSWORD</Text>
      <AppText style={{ color: Colors.black, marginTop: 15, marginBottom: 40 }}>
        Provide your account’s email for which you want to reset your password
      </AppText>

      <AppForm
        initialValues={{ email: "" }}
        onSubmit={submitHandler}
        validationSchema={validationSchema}
      >
        <AppFormField
          name="email"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: showTimer ? "85%" : "100%",
            justifyContent: "space-between",
          }}
        >
          {showTimer && (
            <CountdownCircleTimer
              isPlaying
              duration={30}
              size={35}
              strokeWidth={6}
              colors={[Colors.primary]}
              onComplete={() => setShowTimer(false)}
            >
              {({ remainingTime }) => <AppText>{remainingTime}</AppText>}
            </CountdownCircleTimer>
          )}
          <SubmitButton
            style={{ marginLeft: showTimer ? 10 : 0 }}
            disabled={showTimer}
            title={buttonTitle}
          />
        </View>
      </AppForm>
      <LinkSentAlert />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 15,
  },
  boldText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 45,
    color: Colors.black,
  },
  boldAlertText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 40,
    color: Colors.black,
    textAlign: "center",
    marginTop: 20,
  },
});

export default MainScreen;
