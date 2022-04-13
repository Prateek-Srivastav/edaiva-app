import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import interviewApi from "../api/interview";
import AppText from "../components/AppText";
import CustomHeader from "../components/CustomHeader";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Colors from "../constants/Colors";
import useApi from "../hooks/useApi";

const interviews = [
  {
    companyName: "Iraitech Innovation & Technology",
    job: "SEO Specialist",
    round: "2",
  },
  {
    companyName: "Fiverr Infotech Pvt. Ltd.",
    job: "MERN Stack Developer",
    round: "1",
  },
  {
    companyName: "Fiverr Infotech Pvt. Ltd.",
    job: "Digital Marketing Intern",
    round: "3",
  },
];

const NotificationItem = ({ job, onPress, companyName, round }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.notificationContainer}
    >
      <View style={styles.imgContainer}>
        <Text style={{ fontSize: 17 }}>{companyName[0]}</Text>
      </View>
      <View>
        <Text style={styles.normalText}>{job}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <>
            {/* <View style={styles.separator} /> */}
            <AppText numberOfLines={2}>Round {round}</AppText>
            <Text style={{ ...styles.bodyText }} numberOfLines={1}>
              {companyName}
            </Text>
          </>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
            <NoData
              onPress={() => loadInterviews()}
              text="You don't have any interviews!"
            />
          ) : (
            <FlatList
              contentContainerStyle={{ width: "100%" }}
              data={interviews}
              keyExtractor={(index) => index + Math.random()}
              renderItem={(itemData) => {
                // const { city, state, country } =
                //   itemData.item.job.job_location[0];

                // const location = `${city}, ${state}, ${country}`;
                // const notificId = itemData.item.notification_id;
                return (
                  <>
                    <NotificationItem
                      onPress={() =>
                        navigation.navigate("ApplicationStatus", {
                          // location,
                          // applicationStatus: itemData.item.status,
                          // applicationId: itemData.item._id.$oid,
                        })
                      }
                      job={itemData.item.job}
                      companyName={itemData.item.companyName}
                      round={itemData.item.round}
                    />
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
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 3,
  },
  normalText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 17,
    color: Colors.primary,
  },
  bodyText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 15,
    color: Colors.grey,
  },
  notificationContainer: {
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 20,
    backgroundColor: Colors.white,
    borderRadius: 4,
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

export default InterviewsListingScreen;
