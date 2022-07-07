import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import { FlatList, Image, View, StyleSheet, Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

import AppText from "../../components/AppText";
import Colors from "../../constants/Colors";
import useApi from "../../hooks/useApi";
import NetworkError from "../../components/NetworkError";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import CustomHeader from "../../components/CustomHeader";
import campusApi from "../../api/campusApis/application";
import notificationApi from "../../api/notifications";
import NoData from "../../components/NoData";
import cache from "../../utilities/cache";
import showToast from "../../components/ShowToast";

const NormalText = (props) => (
  <Text {...props} style={{ ...styles.normalText, ...props.style }}>
    {props.children}
  </Text>
);

const NotificationItem = ({ onPress, title, body, onDelete, image }) => {
  const renderRightActions = () => (
    <View
      style={{
        justifyContent: "center",
        alignItems: "flex-end",
        width: 50,
        marginHorizontal: 10,
        marginRight: 20,
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
            source={{ uri: image }}
            // resizeMode="contain"
            style={{
              height: 35,
              width: 35,
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
          </View>
          <AppText numberOfLines={2}>{body}</AppText>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

function CampusNotificationsScreen({ navigation }) {
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

  const loadScreen = async () => {
    setNotificLoading(true);
    setLoading(true);

    const applicationResponse = await campusApi.getCampusApplications();

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
        return console.log("token not valid");
        // return setTokenValid(false);
      } else {
        setData(applicationResponse.data);
        setLoading(false);
        return setError(true);
      }
    }
    // console.log(notificResponse);

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

  return (
    <>
      <CustomHeader backDisabled screenName="Notifications" />
      {loading || notificLoading || !notifications ? (
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
                const notificId = itemData.item.notification_id;

                return (
                  <>
                    <NotificationItem
                      onPress={() => navigation.navigate("CampusApplications")}
                      title={
                        itemData.item.notification.notification_details.title
                      }
                      body={
                        itemData.item.notification.notification_details.body
                      }
                      image={
                        itemData.item.notification.notification_details.image
                      }
                      onDelete={() => {
                        setNotifications(
                          notifications.filter((notific) => {
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
    padding: 3,
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
