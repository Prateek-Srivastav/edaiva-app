import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";

import AppText from "../components/AppText";
import Card from "../components/Card";
import Colors from "../constants/Colors";

const { width, height } = Dimensions.get("screen");

const NormalText = ({ children }) => (
  <Text
    style={{
      color: Colors.black,
      fontFamily: "OpenSans-Regular",
      fontSize: 14.5,
      marginTop: 5,
      marginBottom: 10,
    }}
  >
    {children}
  </Text>
);

function JobDetails({ data: jobDetails }) {
  const [showDetail, setShowDetail] = useState(1);
  const [isPressed, setIsPressed] = useState(false);

  // const { width } = Dimensions.get("screen");
  const [position] = useState(new Animated.ValueXY());

  // const data = dummyData[1];

  const animStyles = {
    top: 0,
    borderRadius: 20,
    height: 3,
    width: width / 6,
    backgroundColor: Colors.primary,
    transform: position.getTranslateTransform(),
  };

  const Description = ({ show }) => {
    const systemFonts = [...defaultSystemFonts, "OpenSans-Regular"];

    const animate = (value) => {
      Animated.timing(position, {
        toValue: { x: value, y: 0 },
        duration: 160,
        useNativeDriver: true,
      }).start();
    };

    let detail;
    if (show === 1) {
      detail = jobDetails.job_description;
      animate(width / 20);
    } else if (show === 2) {
      detail = jobDetails.job_requirements;
      animate(width / 2.4);
    } else if (show === 3) {
      detail = jobDetails.preferred_qualification;
      animate(width / 1.44);
    }

    return (
      <View
        style={{
          paddingHorizontal: 20,
          // paddingBottom: 20,
          width: "100%",
          marginTop: show === 2 ? 0 : 10,
        }}
      >
        {show !== 3 ? (
          <RenderHtml
            contentWidth={width}
            source={{
              html: detail,
            }}
            systemFonts={systemFonts}
            baseStyle={{
              fontFamily: "OpenSans-Regular",
              fontSize: 14.5,
              color: Colors.black,
            }}
          />
        ) : (
          <>
            <AppText>Minimum Qualification</AppText>
            <RenderHtml
              contentWidth={width}
              source={{
                html: jobDetails.minimum_qualification,
              }}
              systemFonts={systemFonts}
              baseStyle={{
                fontFamily: "OpenSans-Regular",
                fontSize: 14.5,
                color: Colors.black,
              }}
            />
            <AppText>Preferred Qualification</AppText>
            <RenderHtml
              contentWidth={width}
              source={{
                html: jobDetails.preferred_qualification,
              }}
              systemFonts={systemFonts}
              baseStyle={{
                fontFamily: "OpenSans-Regular",
                fontSize: 14.5,
                color: Colors.black,
              }}
            />
            <AppText>Job Supplements</AppText>
            <NormalText>{jobDetails.job_supplement_pay[0].name}</NormalText>
            <AppText>Job Schedule</AppText>
            <NormalText>{jobDetails.job_schedule[0].name}</NormalText>
            {!jobDetails.salary_undisclosed && jobDetails.salary && (
              <>
                <AppText>Salary</AppText>
                <NormalText>
                  ₹{jobDetails.salary.salary_from} - ₹
                  {jobDetails.salary.salary_to} {jobDetails.salary.salary_type}
                </NormalText>
              </>
            )}
            <AppText>Remote</AppText>
            <NormalText>{jobDetails.job_remote.name}</NormalText>
            <AppText>Open Positions</AppText>
            <NormalText>{jobDetails.no_of_vacancy}</NormalText>
          </>
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        paddingBottom: 10,
        backgroundColor: Colors.bg,
      }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View
          style={{
            // flex: 1,
            // borderWidth: 1,
            width: "100%",
            // justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card style={styles.card}>
            <Card
              style={{
                // marginTop: 20,
                paddingHorizontal: 13,
                paddingRight: 3,
                // marginLeft: 0,
                alignSelf: "center",
              }}
            >
              <View style={styles.cardBlue}>
                <AppText style={{ color: Colors.primary }}>
                  {jobDetails.job_type.name}
                </AppText>
              </View>
            </Card>
            <Card
              style={{
                flexDirection: "column",
                alignSelf: "center",
                width: "100%",
                // alignItems: "space-evenly",
                paddingHorizontal: 30,
                paddingVertical: 17,
                // backgroundColor: "blue",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <View>
                  <AppText style={{ marginBottom: 6 }}>Degree</AppText>
                  {jobDetails.qualification.map((qual) => (
                    <AppText style={styles.requirementText} key={qual._id}>
                      {qual.name}
                    </AppText>
                  ))}
                </View>
                <View>
                  <AppText style={{ marginBottom: 6 }}>Work Experience</AppText>
                  <AppText style={styles.requirementText}>
                    {jobDetails.job_exp_from}-{jobDetails.job_exp_to} Years
                  </AppText>
                </View>
              </View>
              <View>
                <AppText style={{ marginBottom: 6 }}>Required skills</AppText>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  {jobDetails.skills.map((skill, index) => (
                    <AppText style={styles.requirementText} key={index}>
                      {skill.name}
                    </AppText>
                  ))}
                </View>
              </View>
            </Card>
          </Card>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <TouchableOpacity onPress={() => setShowDetail(1)}>
            <AppText style={styles.detailsHeading}>DESCRIPTION</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDetail(2)}>
            <AppText style={styles.detailsHeading}>RESPONSIBILITY</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDetail(3)}>
            <AppText style={styles.detailsHeading}>MORE</AppText>
          </TouchableOpacity>
        </View>
        <View
          style={{
            // borderWidth: 1,
            width: "85%",
            // marginHorizontal: 20,
            marginTop: 3,
          }}
        >
          <Animated.View style={animStyles} />
        </View>
        <Description show={showDetail} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    // top: -5,
    flexDirection: "column",
    // flex: 0.75,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  cardBlue: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 3,
    backgroundColor: Colors.cardBlue,
    paddingVertical: 3,
    marginRight: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: Colors.bg,
    // width: width,
    // borderWidth: 1,
    // paddingBottom: 200,
  },
  detailsHeading: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 15,
    color: Colors.primary,
  },
  heading: {
    fontFamily: "OpenSans-Bold",
    fontSize: 25,
    color: Colors.primary,
  },
  requirementText: {
    fontFamily: "OpenSans-Medium",
    color: Colors.black,
    fontSize: 15,
    marginStart: 5,
  },
  text: {
    fontFamily: "OpenSans-Medium",
    color: Colors.primary,
    fontSize: 15.5,
  },
});

export default JobDetails;
