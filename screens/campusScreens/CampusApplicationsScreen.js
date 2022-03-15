import React, { useEffect } from "react";
import { FlatList, View, StyleSheet } from "react-native";

import ApplicationItemCard from "../../components/ApplicationsItemCard";
import applicationApi from "../../api/application";
import Colors from "../../constants/Colors";
import { formattedDate } from "../../utilities/date";
import useApi from "../../hooks/useApi";
import { useIsFocused } from "@react-navigation/native";
import NetworkError from "../../components/NetworkError";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import cache from "../../utilities/cache";
import campusApi from "../../api/campusApis/application";
import CustomHeader from "../../components/CustomHeader";

function CampusApplicationsScreen({ navigation }) {
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

  if (data?.detail === "Your are not a part of any institution !")
    return navigation.navigate("CampusSelection");

  const numOfApplications = async () => {
    await cache.store("campusApplications", applications?.length);
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

  return (
    <>
      <CustomHeader screenName="Applications" backDisabled />
      {loading ? (
        <Loading />
      ) : networkError && !loading ? (
        <NetworkError onPress={() => loadApplications()} />
      ) : error ? (
        <Error onPress={() => loadApplications()} />
      ) : (
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingBottom: 20,
            }}
            data={applications}
            keyExtractor={(item) => item._id}
            renderItem={(itemData) => {
              const { city, state, country } =
                itemData.item.campus_job_details.details.job_location[0];

              const location = `${city}, ${state}, ${country}`;

              const { job_title, _id } =
                itemData.item.campus_job_details.details;

              return (
                <ApplicationItemCard
                  onPress={() =>
                    navigation.navigate("CampusApplicationStatus", {
                      jobId: _id,
                      location,
                      applicationStatus: itemData.item.status,
                      applicationId: itemData.item._id,
                      isCampus: true,
                    })
                  }
                  applicationId={itemData.item._id}
                  heading={job_title}
                  companyName={itemData.item.company_details[0].name}
                  location={location}
                  appliedOn={formattedDate(itemData.item.createdAt)}
                  applicationStatus={itemData.item.status}
                  isRevoked={getIsRevoked}
                  isCampus={true}
                />
              );
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
});

export default CampusApplicationsScreen;
