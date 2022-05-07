import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import applicationApi from "../api/application";
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

const NotificationItem = ({
  job,
  onPress,
  companyName,
  round,
  applicationId,
}) => {
  const {
    data: applicationData,
    loading,
    error: applicationError,
    request: loadApplicationDetails,
  } = useApi(applicationApi.getApplications);

  useEffect(() => {
    loadApplicationDetails(applicationId);
    // loadInterviews(applicationId);
  }, []);

  // console.log(applicationData[0].job.job_title);

  if (loading || !applicationData) return <Loading />;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.notificationContainer}
    >
      <View style={styles.imgContainer}>
        <Text style={{ fontSize: 17 }}>
          {applicationData[0].job.company[0].name[0]}
        </Text>
      </View>
      <View style={{ width: "100%" }}>
        <Text style={styles.normalText} numberOfLines={1} ellipsizeMode="tail">
          {job}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <>
            <AppText numberOfLines={2}>Round {round}</AppText>
            <View style={styles.separator} />
            <Text
              style={{ ...styles.bodyText }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {applicationData[0].job.company[0].name}
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
  console.log(data);

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
              data={data}
              keyExtractor={(index) => index + Math.random()}
              renderItem={(itemData) => {
                let location;
                if (itemData.item.job[0].job_location?.length !== 0)
                  location = `${
                    itemData.item?.job[0].job_location[0]?.city
                      ? itemData.item?.job[0].job_location[0]?.city + ","
                      : null
                  } ${
                    itemData.item?.job[0].job_location[0]?.state
                      ? itemData.item?.job[0].job_location[0]?.state + ","
                      : null
                  } ${
                    itemData.item?.job[0].job_location[0]?.country
                      ? itemData.item?.job[0].job_location[0]?.country
                      : null
                  }`;

                // if (itemData.item.interview_completed) return;

                return (
                  <>
                    <NotificationItem
                      onPress={() =>
                        navigation.navigate("ApplicationStatus", {
                          location,
                          applicationStatus:
                            itemData.item.application[0].status,
                          applicationId: itemData.item.application[0]._id.$oid,
                        })
                      }
                      applicationId={itemData.item.application[0]._id.$oid}
                      job={itemData.item.job[0].job_title}
                      companyName={itemData.item.job[0].company.name}
                      round={itemData.item.interview_round}
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
    width: "70%",
  },
  bodyText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 15,
    color: Colors.grey,
    width: "50%",
  },
  notificationContainer: {
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 20,
    backgroundColor: Colors.white,
    borderRadius: 4,
    // flex: 1,
    width: "100%",
  },
  separator: {
    height: 20,
    width: 1.2,
    borderRadius: 10,
    marginHorizontal: 8,
    backgroundColor: "#D4D4D4",
  },
});

export default InterviewsListingScreen;
