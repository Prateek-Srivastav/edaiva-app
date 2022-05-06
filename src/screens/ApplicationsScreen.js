import React, { useEffect } from "react";
import { FlatList, View, StyleSheet, BackHandler } from "react-native";

import ApplicationItemCard from "../components/ApplicationsItemCard";
import applicationApi from "../api/application";
import Colors from "../constants/Colors";
import { formattedDate } from "../utilities/date";
import useApi from "../hooks/useApi";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import NetworkError from "../components/NetworkError";
import Error from "../components/Error";
import Loading from "../components/Loading";
import cache from "../utilities/cache";
import NoData from "../components/NoData";

function ApplicationsScreen({ navigation }) {
  const isFocused = useIsFocused();

  const {
    data,
    error,
    networkError,
    loading,
    request: loadApplications,
  } = useApi(applicationApi.getApplications);

  let applications;

  if (data) {
    applications = data;
  }
  const numOfApplications = async () => {
    await cache.store("applications", applications?.length);
  };

  const getIsRevoked = (val) => {
    if (val) {
      loadApplications();
      numOfApplications();
    }
  };

  useEffect(() => {
    loadApplications();
    numOfApplications();
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // console.log("abcdefgh")
        navigation.navigate("Jobs");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  if (loading) return <Loading />;

  if (networkError && !loading)
    return <NetworkError onPress={() => loadApplications()} />;

  if (error) return <Error onPress={() => loadApplications()} />;

  return (
    <View style={styles.container}>
      {!loading && !error && !networkError && data?.length === 0 ? (
        <NoData
          onPress={() => {
            loadApplications();
            numOfApplications();
          }}
          text="You haven't applied for any job, start applying!"
        />
      ) : (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingBottom: 20,
          }}
          data={applications}
          keyExtractor={(item, index) => item._id.$oid}
          renderItem={(itemData) => {
            let location;

            if (itemData.item.job.job_location?.length !== 0)
              location = `${
                itemData.item.job.job_location[0]?.city
                  ? itemData.item.job.job_location[0]?.city + ","
                  : null
              } ${
                itemData.item.job.job_location[0]?.state
                  ? itemData.item.job.job_location[0]?.state + ","
                  : null
              } ${
                itemData.item.job.job_location[0]?.country
                  ? itemData.item.job.job_location[0]?.country
                  : null
              }`;

            const {
              job_title,
              company,
              job_type,
              created_on,
              job_description,
            } = itemData.item.job;

            return (
              <ApplicationItemCard
                onPress={() =>
                  navigation.navigate("ApplicationStatus", {
                    jobId: itemData.item.job._id.$oid,
                    location,
                    applicationStatus: itemData.item.status,
                    applicationId: itemData.item._id.$oid,
                  })
                }
                applicationId={itemData.item._id.$oid}
                heading={job_title}
                companyName={company[0].name}
                location={location}
                appliedOn={formattedDate(itemData.item.date_applied.$date)}
                applicationStatus={itemData.item.status}
                isRevoked={getIsRevoked}
              />
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
});

export default ApplicationsScreen;
