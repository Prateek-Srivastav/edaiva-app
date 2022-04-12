import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import interviewApi from "../api/interview";
import AppText from "../components/AppText";
import CustomHeader from "../components/CustomHeader";
import Loading from "../components/Loading";
import Colors from "../constants/Colors";
import useApi from "../hooks/useApi";

function InterviewsListingScreen({ navigation }) {
  const {
    res,
    data,
    loading,
    request: loadInterviews,
  } = useApi(interviewApi.getInterviews);
  console.log(res);

  useEffect(() => {
    loadInterviews();
  }, []);

  return (
    <>
      <CustomHeader
        navigation={navigation}
        backScreen={"Profile"}
        screenName="Interviews"
      />
      {loading || !data ? (
        <Loading />
      ) : (
        <View style={styles.container}>
          {data?.length === 0 ? (
            <AppText style={{ fontSize: 18 }}>
              You don't have any interviews
            </AppText>
          ) : (
            <View></View>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default InterviewsListingScreen;
