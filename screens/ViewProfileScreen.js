import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import cache from "../utilities/cache";
import candidateApi from "../api/candidate";
import Card from "../components/Card";
import Colors from "../constants/Colors";
import CustomHeader from "../components/CustomHeader";
import Error from "../components/Error";
import NetworkError from "../components/NetworkError";
import useApi from "../hooks/useApi";
import Loading from "../components/Loading";
import PersonalDetails from "../components/profileDetails/PersonalDetails";
import ViewAbout from "../components/profileDetails/ViewAbout";
import ExperienceDetails from "../components/profileDetails/ExperienceDetails";
import refreshAccessToken from "../utilities/refreshAccessToken";
import { Pencil } from "../assets/svg/icons";
import AcademicDetails from "../components/profileDetails/AcademicDetails";
import SkillDetails from "../components/profileDetails/SkillDetails";
import ProjectDetails from "../components/profileDetails/ProjectDetails";
import CertificationDetails from "../components/profileDetails/CertificationDetails";
import AchievementDetails from "../components/profileDetails/AchievementDetails";
import PublicationDetails from "../components/profileDetails/PublicationDetails";
import PatentDetails from "../components/profileDetails/PatentDetails";
import SocialLinkDetails from "../components/profileDetails/SocialLinkDetails";

const { width, height } = Dimensions.get("window");

const SmallText = (props) => (
  <Text style={styles.smallText}>{props.children}</Text>
);

const NormalText = (props) => (
  <Text style={styles.normalText}>{props.children}</Text>
);

const LargeText = (props) => (
  <Text style={styles.largeText}>{props.children}</Text>
);

function ViewProfileScreen({ navigation }) {
  const [user, setUser] = useState({});
  const [about, setAbout] = useState();

  const {
    data,
    error,
    networkError,
    loading,
    tokenValid,
    request: loadProfile,
  } = useApi(candidateApi.getProfile);

  const isFocused = useIsFocused();

  useEffect(async () => {
    loadProfile();
    if (!tokenValid) {
      console.log(tokenValid);
      await refreshAccessToken();
      await loadProfile();
    }
    const userDetail = await cache.get("user");
    setUser(userDetail);
    setAbout(data.description);
  }, [isFocused]);

  if (networkError && !loading) return <NetworkError onPress={loadProfile} />;

  if (error) return <Error onPress={loadProfile} />;

  const DetailHeading = ({ label, onPress }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // borderWidth: 1,
        width: "100%",
      }}
    >
      <SmallText>{label}</SmallText>
    </View>
  );

  const AddDetails = (props) => {
    return (
      <>
        <View
          style={{
            marginHorizontal: 15,
            marginBottom: props.isNotLine ? 20 : 0,
          }}
        >
          <SmallText>{props.label}</SmallText>
          {props.children}
        </View>
        {!props.isNotLine && <View style={styles.line} />}
      </>
    );
  };

  return loading || !data ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <CustomHeader
        screenName="View Profile"
        backScreen="Profile"
        navigation={navigation}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          elevation: 3,
          borderRadius: 9,
          paddingVertical: 20,
          backgroundColor: "white",
          marginBottom: 5,
        }}
      >
        <Image
          source={require("../assets/dummyDP.png")}
          style={{ height: 70, width: 70, marginRight: 5, marginLeft: 8 }}
        />
        <View style={{ width: "70%", marginRight: 5 }}>
          <LargeText>
            {user.firstname} {user.lastname}
          </LargeText>
          {data.designation && (
            <Card style={{ justifyContent: "flex-start", paddingVertical: 5 }}>
              <NormalText>{data.designation}</NormalText>
            </Card>
          )}
        </View>
      </View>
      <ScrollView>
        <PersonalDetails data={data} viewing />

        <View style={{ ...styles.line, marginTop: 15 }} />
        <View style={{ marginHorizontal: 15 }}>
          <DetailHeading label="About" />

          <ViewAbout data={data.description} />
        </View>
        <View style={styles.line} />
        <AddDetails label="Experience">
          {data.experience.map((exp) => (
            <ExperienceDetails
              experience={exp}
              data={data}
              index={data.experience.indexOf(exp)}
              viewing
            />
          ))}
        </AddDetails>
        <AddDetails label="Academics">
          {data.qualification.map((qual) => (
            <AcademicDetails
              academic={qual}
              data={data}
              index={data.qualification.indexOf(qual)}
              viewing
            />
          ))}
        </AddDetails>
        <AddDetails label="Skills">
          {data.skills.map((skill) => (
            <SkillDetails
              skill={skill}
              data={data}
              index={data.skills.indexOf(skill)}
              viewing
            />
          ))}
        </AddDetails>
        <AddDetails label="Projects">
          {data.projects.map((project) => (
            <ProjectDetails
              project={project}
              data={data}
              index={data.projects.indexOf(project)}
              viewing
            />
          ))}
        </AddDetails>
        <AddDetails label="Certifications">
          {data.certifications.map((certification) => (
            <CertificationDetails
              certification={certification}
              data={data}
              index={data.certifications.indexOf(certification)}
              viewing
            />
          ))}
        </AddDetails>
        <AddDetails label="Publications">
          {data.publications.map((publication) => (
            <PublicationDetails
              publication={publication}
              data={data}
              index={data.publications.indexOf(publication)}
              viewing
            />
          ))}
        </AddDetails>
        <AddDetails label="Patents">
          {data.patents.map((patent) => (
            <PatentDetails
              patent={patent}
              data={data}
              index={data.patents.indexOf(patent)}
              viewing
            />
          ))}
        </AddDetails>
        <AddDetails label="Achievements">
          {data.achievements.map((achievement) => (
            <AchievementDetails
              achievement={achievement}
              data={data}
              index={data.achievements.indexOf(achievement)}
              viewing
            />
          ))}
        </AddDetails>
        <AddDetails isNotLine label="Social Links">
          <SocialLinkDetails sociallinks={data.sociallinks} />
        </AddDetails>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 36,
    width: 36,
    // borderWidth: 1,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    right: -9,
  },
  buttonContainer: {
    height: 36,
    width: 36,
    // borderWidth: 1,
    borderRadius: 18,
    overflow: "hidden",
    // position: "absolute",
    // right: 30,
  },
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // alignSelf: "space-around",
    backgroundColor: Colors.bg,
    // paddingTop: 40,
  },
  line: {
    // height: 27,
    // alignSelf: "center",
    width: "85%",
    height: 1.6,
    borderRadius: 10,
    // marginHorizontal: 5,
    alignSelf: "center",
    backgroundColor: Colors.grey,
    elevation: 1,
    marginTop: 10,
    marginBottom: 20,
    opacity: 0.1,
  },
  smallText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 15.5,
    color: Colors.primary,
  },
  normalText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 17,
    color: Colors.primary,
  },
  largeText: {
    fontFamily: "OpenSans-Bold",
    fontSize: 22,
    color: Colors.primary,
    // marginBottom: 5,
  },
});

export default ViewProfileScreen;
