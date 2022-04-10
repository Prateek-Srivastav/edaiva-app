import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import * as WebBrowser from "expo-web-browser";

import AppText from "./AppText";
import Colors from "../constants/Colors";
import HorizontalLine from "./HorizontalLine";
import {
  Wishlist,
  Preference,
  Profile,
  Help,
  Privacy,
  Document,
  SignOut,
  Campus,
} from "../assets/svg/icons";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import cache from "../utilities/cache";
import CustomAlert from "./CustomAlert";
import CustomButton from "./CustomButton";
import useApi from "../hooks/useApi";
import campusCandidateApi from "../api/campusApis/candidate";
import candidateApi from "../api/candidate";

const NormalText = (props) => (
  <Text style={styles.normalText}>{props.children}</Text>
);

const LargeText = (props) => (
  <Text style={styles.largeText}>{props.children}</Text>
);

const OtherInfosComponent = ({ icon, detail, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 10,
    }}
  >
    {icon}
    <NormalText>{detail}</NormalText>
  </TouchableOpacity>
);

const NavigatorButton = ({ title, icon, ...otherProps }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    {...otherProps}
    style={styles.navigatorButtonContainer}
  >
    <View style={styles.iconContainer}>{icon}</View>
    <Text style={styles.navigatorText}>{title}</Text>
  </TouchableOpacity>
);

function CustomDrawer(props) {
  const { setTokens } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [visible, setVisible] = useState(false);

  const { data: campusProfileData, request: loadCampusProfile } = useApi(
    campusCandidateApi.getProfile
  );

  const {
    data,
    error,
    networkError,
    loading,
    request: loadProfile,
  } = useApi(candidateApi.getProfile);

  const getUser = async () => {
    const data = await cache.get("user");
    setUser(data);
  };

  useEffect(() => {
    getUser();
    loadCampusProfile();
    loadProfile();
  }, []);

  const { firstname, lastname, email } = user;

  const SignOutAlert = () => {
    return (
      <CustomAlert visible={visible}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              color: Colors.black,
              fontFamily: "OpenSans-Regular",
            }}
          >
            Sure! You want to
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: Colors.black,
              fontFamily: "OpenSans-SemiBold",
            }}
          >
            Sign Out
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: -40,
          }}
        >
          <CustomButton
            onPress={() => {
              setTokens(null);
              authStorage.removeToken();
            }}
            title="Yes"
            titleStyle={{ color: Colors.primary }}
            style={{ backgroundColor: "#FFFFFF", elevation: 3 }}
          />
          <CustomButton
            // activeOpacity={0.3}
            onPress={() => setVisible(false)}
            title="Cancel"
            titleStyle={{ color: Colors.primary }}
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#C1EFFF",
              borderWidth: 1,
              marginLeft: 10,
            }}
          />
        </View>
      </CustomAlert>
    );
  };

  return (
    <DrawerContentScrollView {...props} style={{ padding: 25 }}>
      <LargeText>
        {firstname} {lastname}
      </LargeText>
      <AppText>{email}</AppText>
      <HorizontalLine marginTop={10} />
      <View style={styles.navigatorsContainer}>
        <View>
          <NavigatorButton
            title="Profile"
            icon={<Profile />}
            onPress={() =>
              props.navigation.navigate(
                error && data?.error === "Candidate Profile not found!!"
                  ? "CreateProfile"
                  : "ProfileStack"
              )
            }
          />
          <NavigatorButton
            title="Preference"
            icon={<Preference />}
            onPress={() => props.navigation.navigate("Preference")}
          />
        </View>
        <View>
          <NavigatorButton
            title={
              campusProfileData?.detail !==
              "Your are not a part of any institution !"
                ? "Jobs"
                : "Campus"
            }
            icon={<Campus />}
            onPress={() =>
              props.navigation.navigate(
                campusProfileData?.detail !==
                  "Your are not a part of any institution !"
                  ? "Home"
                  : campusProfileData?.detail ===
                    "Your are not a part of any institution !"
                  ? "CampusSelection"
                  : "CampusStack"
              )
            }
          />
          <NavigatorButton
            title="Wishlist"
            icon={<Wishlist />}
            onPress={() => props.navigation.navigate("WishlistStack")}
          />
        </View>
      </View>
      <HorizontalLine />
      <AppText style={{ marginTop: 25 }}>HELP & INFO</AppText>
      <OtherInfosComponent
        onPress={() =>
          WebBrowser.openBrowserAsync("https://jobs.edaiva.com/contact")
        }
        detail="Help Center"
        icon={<Help />}
      />
      <OtherInfosComponent
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "https://jobs.edaiva.com/legal/terms-of-service/f3efcde4-5606-44ef-8e74-c9145dfe9b8d"
          )
        }
        detail="Terms and Conditions"
        icon={<Document />}
      />
      <OtherInfosComponent
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "https://jobs.edaiva.com/legal/privacy-policy/da0304c3-2554-48fd-b6a8-e41b5ec8ad5e"
          )
        }
        detail="Privacy Policy"
        icon={<Privacy />}
      />
      <HorizontalLine marginVertical={25} marginTop={15} />
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => setVisible(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <SignOut color={Colors.grey} />
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
      <SignOutAlert />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 3,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  largeText: {
    fontFamily: "OpenSans-Bold",
    fontSize: 22,
    color: Colors.primary,
  },
  navigatorButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  navigatorsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 25,
  },
  navigatorText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    color: Colors.black,
    marginTop: 7,
  },
  normalText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 17.5,
    color: Colors.black,
    marginLeft: 25,
  },
  signOutText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 19,
    color: Colors.black,
    marginLeft: 20,
  },
});

export default CustomDrawer;
