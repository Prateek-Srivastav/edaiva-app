import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  View,
  StyleSheet,
  Text,
  BackHandler,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import AppText from "../components/AppText";
import Colors from "../constants/Colors";
import applicationApi from "../api/application";
import notificationApi from "../api/notifications";
import useApi from "../hooks/useApi";
import { useIsFocused } from "@react-navigation/native";
import NetworkError from "../components/NetworkError";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import CustomHeader from "../components/CustomHeader";
import cache from "../utilities/cache";
import showToast from "../components/ShowToast";
import NoData from "../components/NoData";

const NormalText = (props) => (
  <Text {...props} style={{ ...styles.normalText, ...props.style }}>
    {props.children}
  </Text>
);

const NotificationItem = ({
  job,
  onPress,
  companyName,
  title,
  body,
  onDelete,
}) => {
  let image;
  let heading;
  let details;

  let status = body.split(" ");
  status = status[status.length - 1];

  if (status === "Hired") {
    image = require("../assets/selected.png");
    heading = "Congratulations!!.. You did it.";
    details = `You are selected for the role of ${job} in ${companyName}.`;
  } else if (status === "Finalist") {
    image = require("../assets/shortlisted.png");
    heading = "Woah!. You are the finalist!!..";
    details = `You are the finalist for the ${job} in ${companyName}`;
  } else if (status === "Review") {
    image = require("../assets/shortlisted.png");
    heading = "Woah!. You have been shortlisted!!..";
    details = `You have been shortlisted for the ${job} in ${companyName}`;
  } else if (status === "Interviewing") {
    image = require("../assets/bell.png");
    heading = "Interviewing";
    details = `Your job status for the ${job} in ${companyName} is set to interviewing.`;
  } else return null;

  const renderRightActions = () => (
    <View
      style={{
        justifyContent: "center",
        alignItems: "flex-end",
        width: 50,
        marginHorizontal: 7,
      }}
    >
      <TouchableOpacity
        onPress={onDelete}
        activeOpacity={0.7}
        style={styles.rightActionContainer}
      >
        <Feather name="trash-2" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={() => renderRightActions()}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={styles.notificationContainer}
      >
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
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
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
    </Swipeable>
  );
};

function NotificationsScreen({ navigation }) {
  const isFocused = useIsFocused();

  const [notifications, setNotifications] = useState();
  const [loading, setLoading] = useState(false);
  const [notificLoading, setNotificLoading] = useState(false);
  const [error, setError] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const { request: markSeenNotifications } = useApi(
    notificationApi.markSeenNotifications
  );

  const { res, request: deleteNotification } = useApi(
    notificationApi.deleteNotification
  );
  // // console.log(res);
  const loadScreen = async () => {
    setNotificLoading(true);
    setLoading(true);

    const applicationResponse = await applicationApi.getApplications();

    let notificResponse = await notificationApi.getNotifications("job");

    if (!applicationResponse.ok) {
      // console.log(applicationResponse, "res !ok");
      if (applicationResponse.problem === "NETWORK_ERROR") {
        setLoading(false);
        setNetworkError(true);
        return Toast.show({
          type: "appError",
          text1: "No internet connection!",
        });
      } else if (applicationResponse.data.code === "token_not_valid") {
        setLoading(false);
        // console.log("token not valid");
        return setTokenValid(false);
      } else {
        setData(applicationResponse.data);
        setLoading(false);
        return setError(true);
      }
    }

    notificResponse.data?.records.forEach((notific, index) => {
      const applicationId =
        notific.notification.notification_details.url.split("/")[2];
      const application = applicationResponse.data.filter(
        (application) => application._id.$oid === applicationId
      )[0];

      notificResponse.data.records[index] = {
        ...notific,
        ...application,
        notification_id: notific._id,
      };
    });

    // // console.log(notificResponse);

    setNotifications(notificResponse.data.records);
    setNotificLoading(false);
    setLoading(false);
  };

  useEffect(() => {
    loadScreen();
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      const showNotificDeleteInfo = async () => {
        const isFirstTime = await cache.get("notificOpened");
        // console.log(isFirstTime);
        if (!isFirstTime) {
          showToast({
            type: "appInfo",
            message: "Swipe left on a notification to delete it.",
          });
          await cache.store("notificOpened", true);
        }
      };
      showNotificDeleteInfo();
      markSeenNotifications("job");
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Jobs");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

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
          {!loading &&
          !error &&
          !networkError &&
          notifications?.length === 0 ? (
            <NoData
              onPress={() => {
                loadScreen();
              }}
              text="No notifications for you."
            />
          ) : (
            <FlatList
              contentContainerStyle={{ width: "100%" }}
              data={notifications}
              keyExtractor={(index) => index + Math.random()}
              renderItem={(itemData) => {
                let location;

                if (itemData.item.job_location?.length !== 0)
                  location = `${
                    itemData.item.job_location[0]?.city
                      ? itemData.item.job_location[0]?.city + ","
                      : null
                  } ${
                    itemData.item.job_location[0]?.state
                      ? itemData.item.job_location[0]?.state + ","
                      : null
                  } ${
                    itemData.item.job_location[0]?.country
                      ? itemData.item.job_location[0]?.country
                      : null
                  }`;

                const notificId = itemData.item.notification_id;

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
                      body={
                        itemData.item.notification.notification_details.body
                      }
                      onDelete={() => {
                        setNotifications(
                          notifications.filter((notific) => {
                            // console.log(notific.notification_id);
                            // console.log(notificId + "id");
                            return notific.notification_id !== notificId;
                          })
                        );
                        deleteNotification(notificId);
                      }}
                    />
                    <View style={styles.line} />
                  </>
                );
              }}
            />
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
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  rightActionContainer: {
    backgroundColor: "#ffb3ad",
    width: 50,
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    // position: "absolute",
    // marginHorizontal: 10,
    // flex: 1,
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
