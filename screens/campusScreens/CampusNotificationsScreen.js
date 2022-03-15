import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { FlatList, Image, View, StyleSheet, Text } from "react-native";

import AppText from "../../components/AppText";
import Colors from "../../constants/Colors";
import applicationApi from "../../api/application";
import useApi from "../../hooks/useApi";
import { useIsFocused } from "@react-navigation/native";
import NetworkError from "../../components/NetworkError";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomHeader from "../../components/CustomHeader";
import campusApi from "../../api/campusApis/application";

const NormalText = (props) => (
  <Text {...props} style={{ ...styles.normalText, ...props.style }}>
    {props.children}
  </Text>
);

const NotificationItem = ({ status, job, onPress }) => {
  let image;
  let heading;
  let details;

  if (status === "hired") {
    image = require("../../assets/selected.png");
    heading = "Congratulations!!.. You did it.";
    details = "You are selected for the role of Telecalling in iraitech.";
  } else if (status === "finalist") {
    image = require("../../assets/shortlisted.png");
    heading = "Woah!. You are the finalist!!..";
    details = "You are the finalist for the Tele-calling in.......";
  } else if (status === "shortlisted") {
    image = require("../../assets/shortlisted.png");
    heading = "Woah!. You have been shortlisted!!..";
    details = "You have been shortlisted for the Tele-calling in.......";
  } else if (status === "interviewing") {
    image = require("../../assets/bell.png");
    heading = "Interview Reminder";
    details = "You have an interview schedule today at 2 pm";
  } else return null;

  return (
    <TouchableOpacity onPress={onPress} style={styles.notificationContainer}>
      <View style={styles.imgContainer}>
        <Image
          source={image}
          resizeMode="contain"
          style={{
            height: 25,
            width: 25,
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
        >
          <NormalText>{heading}</NormalText>
          {status === "interviewing" && (
            <>
              <View style={styles.separator} />
              <NormalText style={{ flex: 1 }} numberOfLines={1}>
                {job}
              </NormalText>
            </>
          )}
        </View>
        <AppText numberOfLines={1}>{details}</AppText>
      </View>
    </TouchableOpacity>
  );
};

function CampusNotificationsScreen({ navigation }) {
  const isFocused = useIsFocused();

  const {
    data,
    error,
    networkError,
    loading,
    request: loadApplications,
  } = useApi(campusApi.getCampusApplications);

  let applications;

  if (data) {
    applications = data;
  }

  useEffect(() => {
    loadApplications();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <CustomHeader backDisabled screenName="Notifications" />
      {loading ? (
        <Loading />
      ) : networkError && !loading ? (
        <NetworkError onPress={() => loadApplications()} />
      ) : error ? (
        <Error onPress={() => loadApplications()} />
      ) : (
        <FlatList
          contentContainerStyle={{ width: "100%" }}
          data={applications}
          keyExtractor={(index) => index + Math.random()}
          renderItem={(itemData) => {
            const { city, state, country } =
              itemData.item.campus_job_details.details.job_location[0];

            const location = `${city}, ${state}, ${country}`;

            const { job_title, _id } = itemData.item.campus_job_details.details;

            return (
              <>
                <NotificationItem
                  onPress={() =>
                    navigation.navigate("CampusApplicationStatus", {
                      jobId: _id,
                      location,
                      applicationStatus: itemData.item.status,
                      applicationId: itemData.item._id,
                      isCampus: true,
                    })
                  }
                  job={job_title}
                  status={itemData.item.status}
                />
                {(itemData.item.status === "hired" ||
                  itemData.item.status === "finalist" ||
                  itemData.item.status === "interviewing" ||
                  itemData.item.status === "shortlisted") && (
                  <View style={styles.line} />
                )}
              </>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  imgContainer: {
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    borderRadius: 3,
  },
  largeText: {
    fontFamily: "OpenSans-Bold",
    fontSize: 22,
    color: Colors.primary,
    marginBottom: 5,
  },
  line: {
    alignSelf: "center",
    width: "93%",
    height: 1.2,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: "#EFEFEF",
  },
  normalText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 17,
    color: Colors.primary,
  },
  notificationContainer: {
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 20,
  },
  separator: {
    height: 20,
    width: 1.2,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: "#D4D4D4",
  },
});

export default CampusNotificationsScreen;
