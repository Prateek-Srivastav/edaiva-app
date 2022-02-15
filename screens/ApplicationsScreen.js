import React, { useEffect } from "react";
import { FlatList, View, StyleSheet } from "react-native";

import ApplicationItemCard from "../components/ApplicationsItemCard";
import applicationApi from "../api/application";
import Colors from "../constants/Colors";
import { formattedDate } from "../utilities/date";
import useApi from "../hooks/useApi";
import { useIsFocused } from "@react-navigation/native";
import NetworkError from "../components/NetworkError";
import Error from "../components/Error";
import Loading from "../components/Loading";
import cache from "../utilities/cache";

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

  if (loading) return <Loading />;

  if (networkError && !loading)
    return <NetworkError onPress={loadApplications} />;

  if (error) return <Error onPress={loadApplications} />;

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: 20,
        }}
        data={applications}
        keyExtractor={(item, index) => item._id.$oid}
        renderItem={(itemData) => {
          const { city, state, country } = itemData.item.job.job_location[0];

          const location = `${city}, ${state}, ${country}`;

          const { job_title, company, job_type, created_on, job_description } =
            itemData.item.job;

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
              // isApplied={itemData.job.company.item.applied}
              applicationStatus={itemData.item.status}
              isRevoked={getIsRevoked}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
});

export default ApplicationsScreen;
