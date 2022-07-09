import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";

import AppText from "../../components/AppText";
import authStorage from "../../auth/storage";
import campusCandidateApi from "../../api/campusApis/candidate";
import CustomAlert from "../../components/CustomAlert";
import CustomButton from "../../components/CustomButton";
import CustomHeader from "../../components/CustomHeader";
import Input from "../../components/Input";
import Colors from "../../constants/Colors";
import useApi from "../../hooks/useApi";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import AuthContext from "../../auth/context";
import { ErrorMessage } from "../../components/forms";
import cache from "../../utilities/cache";

function CampusSelectionScreen({ navigation, route }) {
  const [visible, setVisible] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  let batchCode;
  const authContext = useContext(AuthContext);

  // const {
  //   data,
  //   error,
  //   networkError,
  //   loading,
  //   request: joinBatch,
  // } = useApi(campusCandidateApi.joinBatch);

  const submitHandler = async () => {
    if (!batchCode) {
      setErrorVisible(true);
      return;
    }

    setVisible(false);

    setLoading(true);
    const response = await campusCandidateApi.joinBatch({ id: batchCode });

    if (!response.ok) {
      setLoading(false);

      if (response.problem === "NETWORK_ERROR") return setNetworkError(true);
      else {
        setError(true);
        return Toast.show({
          type: "appError",
          text1: response.data?.detail && response.data.detail,
        });
      }
    }
    setNetworkError(false);
    setError(false);
    setLoading(false);

    if (response.data?._id && !loading) {
      Toast.show({
        type: "appSuccess",
        text1: "Welcome to campus placement!",
      });

      if (navigation.getState().routeNames[0] === "Home") {
        authContext.setIsCampusStudent(true);
        await cache.store("isCampusStudent", true);
        return navigation.navigate("CampusStack");
      }
    }
  };

  const BatchCodeModal = () => {
    return (
      <CustomAlert visible={visible} setAlertVisible={setVisible}>
        <Text
          style={{
            fontSize: 20,
            color: Colors.primary,
            fontFamily: "OpenSans-SemiBold",
            textAlign: "center",
          }}
        >
          Batch Code
        </Text>

        <AppText
          style={{ textAlign: "center", fontSize: 15, marginVertical: 15 }}
        >
          Please enter your batch code to continue
        </AppText>

        <Input
          placeholder="Enter batch code"
          onChangeText={(text) => {
            batchCode = text;
          }}
          defaultValue={batchCode}
        />
        <ErrorMessage error="Please enter batch code." visible={errorVisible} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: -40,
          }}
        >
          <CustomButton
            onPress={submitHandler}
            title="Submit"
            style={{ elevation: 3 }}
            disabled={loading}
          />
          <CustomButton
            onPress={() => setVisible(false)}
            title="Cancel"
            titleStyle={{ color: Colors.primary }}
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#C1EFFF",
              borderWidth: 1,
              marginLeft: 10,
            }}
          />
        </View>
      </CustomAlert>
    );
  };

  return (
    <>
      {navigation.getState().routeNames[0] === "Home" && (
        <CustomHeader navigation={navigation} backScreen="Jobs" />
      )}
      <View style={styles.container}>
        <View style={styles.responseContainer}>
          <View
            style={{
              alignSelf: "center",
              // top: 45,
              bottom: 45,
            }}
          >
            <Image source={require("../../assets/education.png")} />
          </View>
          <Text
            style={{
              fontFamily: "OpenSans-SemiBold",
              fontSize: 25,
              color: Colors.black,
              marginTop: -50,
            }}
          >
            Are you a
          </Text>
          <Text
            style={{
              fontFamily: "OpenSans-Bold",
              fontSize: 25,
              color: Colors.primary,
            }}
          >
            Campus Student ?
          </Text>
          <CustomButton
            style={{ flex: 0, width: "70%", marginBottom: 0 }}
            title="Yes!"
            onPress={() => setVisible(true)}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <CustomButton
            style={{ flex: 0, width: "60%", marginBottom: 5 }}
            title="No!"
            onPress={() => {
              if (route.params?.access) {
                authContext.setTokens({
                  access: route.params.access,
                  refresh: route.params.refresh,
                });
                authStorage.storeToken(
                  route.params.access,
                  route.params.refresh
                );
              }

              navigation.navigate("Home");
            }}
          />
          <AppText style={{ fontSize: 19, color: Colors.black }}>
            Just a job seeker
          </AppText>
        </View>
        <AppText style={{ textAlign: "center" }}>
          <AppText style={{ color: "red" }}>*</AppText>Dont worry, You can later
          switch between both.
        </AppText>
        <BatchCodeModal />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    // alignItems: "center",
  },
  responseContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(40, 177, 230, 0.4)",
    borderRadius: 3,
    paddingHorizontal: 20,
    // paddingTop: -60,
    paddingBottom: 40,
  },
});

export default CampusSelectionScreen;
