import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Image, View, StyleSheet, Text } from "react-native";

import AppText from "../components/AppText";
import Colors from "../constants/Colors";
import applicationApi from "../api/application";
import notificationApi from "../api/notifications";
import useApi from "../hooks/useApi";
import { useIsFocused } from "@react-navigation/native";
import NetworkError from "../components/NetworkError";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomHeader from "../components/CustomHeader";

const NormalText = (props) => (
  <Text {...props} style={{ ...styles.normalText, ...props.style }}>
    {props.children}
  </Text>
);

const NotificationItem = ({
  status,
  job,
  onPress,
  companyName,
  title,
  body,
}) => {
  let image;
  let heading;
  let details;

  // console.log(body[-1]);

  if (status === "hired") {
    image = require("../assets/selected.png");
    heading = "Congratulations!!.. You did it.";
    details = `You are selected for the role of ${job} in ${companyName}.`;
  } else if (status === "finalist") {
    image = require("../assets/shortlisted.png");
    heading = "Woah!. You are the finalist!!..";
    details = `You are the finalist for the ${job} in ${companyName}`;
  } else if (status === "finalist") {
    image = require("../assets/shortlisted.png");
    heading = "Woah!. You have been shortlisted!!..";
    details = `You have been shortlisted for the ${job} in ${companyName}`;
  } else if (status === "interviewing") {
    image = require("../assets/bell.png");
    heading = "Interviewing";
    details = `Your job status for the ${job} in ${companyName} is set to interviewing.`;
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
          <NormalText>{title}</NormalText>
          {status === "interviewing" && (
            <>
              <View style={styles.separator} />
              <NormalText style={{ flex: 1 }} numberOfLines={1}>
                {job}
              </NormalText>
            </>
          )}
        </View>
        <AppText numberOfLines={2}>{body}</AppText>
      </View>
    </TouchableOpacity>
  );
};

function NotificationsScreen({ navigation }) {
  const isFocused = useIsFocused();

  const [applications, setApplications] = useState();
  const [notifications, setNotifications] = useState();
  const [loading, setLoading] = useState(false);
  const [notificLoading, setNotificLoading] = useState(false);
  const [error, setError] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  // const {
  //   data,
  //   error,
  //   networkError,
  //   loading,
  //   request: loadApplications,
  // } = useApi(applicationApi.getApplications);

  const loadScreen = async () => {
    setNotificLoading(true);
    setLoading(true);

    const applicationResponse = await applicationApi.getApplications();

    let notificResponse = await notificationApi.getNotifications("job");

    if (!applicationResponse.ok) {
      console.log(applicationResponse, "res !ok");
      if (applicationResponse.problem === "NETWORK_ERROR") {
        setLoading(false);
        setNetworkError(true);
        return Toast.show({
          type: "appError",
          text1: "No internet connection!",
        });
      } else if (applicationResponse.data.code === "token_not_valid") {
        setLoading(false);
        console.log("token not valid");
        return setTokenValid(false);
      } else {
        setData(applicationResponse.data);
        setLoading(false);
        return setError(true);
      }
    }
    // let application = [];

    notificResponse.data.records.forEach((notific, index) => {
      const applicationId =
        notific.notification.notification_details.url.split("/")[2];
      console.log(applicationId);

      const application = applicationResponse.data.filter(
        (application) => application._id.$oid === applicationId
      )[0];

      notificResponse.data.records[index] = { ...notific, ...application };
    });

    // application.map((applic) => {
    //   applic._id.$oid ===
    // })

    // console.log(notificResponse);
    setNotifications(notificResponse.data.records);
    // setApplications(application);
    setNotificLoading(false);
    setLoading(false);
  };

  // if (applications) console.log(applications);

  useEffect(() => {
    loadScreen();
  }, [isFocused]);

  return (
    <>
      <CustomHeader backDisabled screenName="Notifications" />
      {loading || notificLoading ? (
        <Loading />
      ) : networkError && !loading ? (
        <NetworkError onPress={() => loadApplications()} />
      ) : error && !loading ? (
        <Error onPress={() => loadApplications()} />
      ) : (
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={{ width: "100%" }}
            data={notifications}
            keyExtractor={(index) => index + Math.random()}
            renderItem={(itemData) => {
              const { city, state, country } =
                itemData.item.job.job_location[0];

              const location = `${city}, ${state}, ${country}`;

              return (
                <>
                  <NotificationItem
                    onPress={() =>
                      navigation.navigate("ApplicationStatus", {
                        location,
                        applicationStatus: itemData.item.status,
                        applicationId: itemData.item._id.$oid,
                      })
                    }
                    job={itemData.item.job.job_title}
                    status={itemData.item.status}
                    companyName={itemData.item.job.company[0].name}
                    title={
                      itemData.item.notification.notification_details.title
                    }
                    body={itemData.item.notification.notification_details.body}
                  />
                  <View style={styles.line} />
                </>
              );
            }}
          />
        </View>
      )}
    </>
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

export default NotificationsScreen;
