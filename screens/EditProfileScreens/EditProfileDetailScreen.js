import React from "react";
import { View, StyleSheet } from "react-native";

import Colors from "../../constants/Colors";
import AddExperienceScreen from "./AddExperienceScreen";
import AddAcademicsScreen from "./AddAcademicsScreen";
import AddAchievementsScreen from "./AddAchievementsScreen";
import AddCertificationsScreen from "./AddCertificationsScreen";
import AddPatentsScreen from "./AddPatentsScreen";
import AddProjectsScreen from "./AddProjectsScreen";
import AddPublicationsScreen from "./AddPublicationsScreen";
import AddSkillsScreen from "./AddSkillsScreen";
import AddSocialLinksScreen from "./AddSocialLinksScreen";
import PersonalDetailsScreen from "./PersonalDetailsScreen";
import CustomHeader from "../../components/CustomHeader";

function EditProfileDetailScreen({ route, navigation }) {
  const component = route.params.component;
  const data = route.params.data;
  const index = route.params.index;

  let renderScreen;
  let screenName;

  if (component === "personal") {
    screenName = "Personal Details";
    renderScreen = (
      <PersonalDetailsScreen data={data} isCampus={route.params.isCampus} />
    );
  } else if (component === "exp") {
    screenName = "Experience";
    renderScreen = <AddExperienceScreen data={data} index={index} />;
  } else if (component === "acad") {
    screenName = "Academics";
    renderScreen = <AddAcademicsScreen data={data} index={index} />;
  } else if (component === "skills") {
    screenName = "Skills";
    renderScreen = <AddSkillsScreen data={data} index={index} />;
  } else if (component === "projs") {
    screenName = "Projects";
    renderScreen = <AddProjectsScreen data={data} index={index} />;
  } else if (component === "certs") {
    screenName = "Certificates";
    renderScreen = <AddCertificationsScreen data={data} index={index} />;
  } else if (component === "pubs") {
    screenName = "Publications";
    renderScreen = <AddPublicationsScreen data={data} index={index} />;
  } else if (component === "patents") {
    screenName = "Patents";
    renderScreen = <AddPatentsScreen data={data} index={index} />;
  } else if (component === "achievements") {
    screenName = "Achievements";
    renderScreen = <AddAchievementsScreen data={data} index={index} />;
  } else if (component === "socialLinks") {
    screenName = "Social Links";
    renderScreen = <AddSocialLinksScreen data={data} />;
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        backScreen={route.params.isCampus ? "CampusEditProfile" : "EditProfile"}
        navigation={navigation}
        screenName={
          (index >= 0 || component === "personal" ? "Edit " : "Add ") +
          screenName
        }
      />
      {renderScreen}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    flex: 1,
  },
});

export default EditProfileDetailScreen;
