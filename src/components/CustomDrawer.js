import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
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
  JobsIcon,
} from "../assets/svg/icons";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import cache from "../utilities/cache";
import CustomAlert from "./CustomAlert";
import CustomButton from "./CustomButton";
import campusCandidateApi from "../api/campusApis/candidate";
import candidateApi from "../api/candidate";
import useApi from "../hooks/useApi";
import showToast from "./ShowToast";

const { width, height } = Dimensions.get("screen");

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

const NavigatorButton = ({ title, icon, bgColor, ...otherProps }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    {...otherProps}
    style={styles.navigatorButtonContainer}
  >
    <View
      style={[
        styles.iconContainer,
        { backgroundColor: bgColor ? bgColor : Colors.primary },
      ]}
    >
      {icon}
    </View>
    <Text style={styles.navigatorText}>{title}</Text>
  </TouchableOpacity>
);

function CustomDrawer(props) {
  const [visible, setVisible] = useState(false);

  const {
    isAuthSkipped,
    fullName,
    email,
    isProfileComplete,
    isCampusStudent,
    setTokens,
    setFullName,
    setEmail,
    setIsProfileComplete,
    setIsCampusStudent,
  } = useContext(AuthContext);

  const { data: campusProfileData, request: loadCampusProfile } = useApi(
    campusCandidateApi.getProfile
  );

  const { data: profileData, request: loadProfile } = useApi(
    candidateApi.getProfile
  );

  useEffect(() => {
    if (!isAuthSkipped) {
      loadCampusProfile();
      loadProfile();
    }
  }, []);

  useEffect(() => {
    if (profileData?.error === "Candidate Profile not found!!") {
      // console.log(profileData);
      setIsProfileComplete(false);
    } else setIsProfileComplete(true);

    if (campusProfileData && campusProfileData[0]?.batch_id)
      setIsCampusStudent(true);
    else setIsCampusStudent(false);
  }, [profileData, campusProfileData]);

  const signOutHandler = async () => {
    await cache.clear();
    authStorage.removeToken();
    setFullName("fname lname");
    setEmail(null);
    setTokens(null);
    setIsCampusStudent(false);
    setIsProfileComplete(false);
  };

  const SignOutAlert = () => {
    return (
      <CustomAlert visible={visible} setAlertVisible={setVisible}>
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
            onPress={signOutHandler}
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
    <DrawerContentScrollView
      {...props}
      style={{ paddingHorizontal: 25, paddingTop: 25, marginBottom: 15 }}
    >
      {isAuthSkipped && (
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => props.navigation.navigate("Login")}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => props.navigation.navigate("Register")}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.loginText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isAuthSkipped && (
        <>
          <LargeText>{fullName}</LargeText>
          <AppText style={{ fontSize: height < 160 ? 13 : 14 }}>
            {email}
          </AppText>
        </>
      )}
      <HorizontalLine marginTop={10} />
      <View style={styles.navigatorsContainer}>
        <View>
          <NavigatorButton
            title="Profile"
            icon={<Profile />}
            bgColor={isAuthSkipped ? Colors.grey : Colors.primary}
            onPress={() =>
              !isProfileComplete
                ? props.navigation.navigate("CreateProfile", {
                    screenName: "ProfileStack",
                  })
                : isAuthSkipped
                ? showToast({
                    type: "appWarning",
                    message: "You need to login to access this!",
                  })
                : props.navigation.navigate("ProfileStack")
            }
          />
          <NavigatorButton
            title="Preference"
            icon={<Preference />}
            bgColor={isAuthSkipped ? Colors.grey : Colors.primary}
            onPress={() =>
              !isProfileComplete
                ? props.navigation.navigate("CreateProfile", {
                    screenName: "Preference",
                  })
                : isAuthSkipped
                ? showToast({
                    type: "appWarning",
                    message: "You need to login to access this!",
                  })
                : props.navigation.navigate("Preference")
            }
          />
        </View>
        <View>
          <NavigatorButton
            title={!isCampusStudent ? "Campus" : "Jobs"}
            icon={!isCampusStudent ? <Campus /> : <JobsIcon />}
            bgColor={isAuthSkipped ? Colors.grey : Colors.primary}
            onPress={() =>
              isAuthSkipped
                ? showToast({
                    type: "appWarning",
                    message: "You need to login to access this!",
                  })
                : props.navigation.navigate(
                    isCampusStudent
                      ? "Home"
                      : !isCampusStudent
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
      {!isAuthSkipped && (
        <>
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
        </>
      )}

      <SignOutAlert />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 3,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  largeText: {
    fontFamily: "OpenSans-Bold",
    fontSize: height < 160 ? 16 : 22,
    color: Colors.primary,
  },
  navigatorButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  navigatorsContainer: {
    flexDirection: "row",
    marginVertical: 25,
    justifyContent: "space-around",
  },
  navigatorText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    color: Colors.black,
    marginTop: 7,
  },
  normalText: {
    fontFamily: "OpenSans-Medium",
    fontSize: height < 160 ? 14 : 17.5,
    color: Colors.black,
    marginLeft: 25,
  },
  signOutText: {
    fontFamily: "OpenSans-Medium",
    fontSize: height < 160 ? 15 : 19,
    color: Colors.black,
    marginLeft: 20,
  },
  loginText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: height < 160 ? 15 : 19,
    color: Colors.primary,
  },
  separator: {
    // top: 15,
    // flex: 0.5,
    // flexDirection: "column",
    marginHorizontal: 15,
    width: 1.2,
    borderRadius: 10,
    backgroundColor: "#D4D4D4",
  },
});

export default CustomDrawer;
