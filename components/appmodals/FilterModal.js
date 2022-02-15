import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  useWindowDimensions,
  TouchableNativeFeedback,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  // Dimensions,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

import { Feather, AntDesign } from "@expo/vector-icons";

import AppText from "../AppText";
import Colors from "../../constants/Colors";
import CustomButton from "../CustomButton";
import useApi from "../../hooks/useApi";
import AppPicker from "../AppPicker";
import Card from "../Card";
import CardInput from "../CardInput";
import locationApi from "../../api/location";

const { width, height } = Dimensions.get("screen");

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 600,
};

const experienceData = [
  { _id: 1, name: "0-5 yrs" },
  { _id: 2, name: "5-10 yrs" },
  { _id: 3, name: "10-20 yrs" },
  { _id: 4, name: "20+ yrs" },
];

function FilterModal(props) {
  const dimensions = useWindowDimensions();

  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [city, setCity] = useState();
  const [experience, setExperience] = useState();
  const [keyword, setKeyword] = useState();
  const [isLocationShown, setIsLocationShown] = useState(false);
  const [isJobTypeShown, setIsJobTypeShown] = useState(false);
  const [isExperienceShown, setIsExperienceShown] = useState(false);
  const [isSkillsShown, setIsSkillsShown] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [skillsItemArray, setSkillsItemArray] = useState([]);
  const [skillItemText, setSkillItemText] = useState();
  const top = useSharedValue(Dimensions.get("screen").height);

  const style = useAnimatedStyle(() => {
    return {
      top: top.value,
    };
  });

  function sendFilters(val) {
    props.sendData(val);
  }

  const sendIsPressed = () => {
    props.sendIsPressed();
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart(_, context) {
      context.startTop = top.value;
    },
    onActive(event, context) {
      top.value = context.startTop + event.translationY;
    },
    onEnd(event) {
      if (event.translationY > 50)
        top.value = withSpring(dimensions.height + 50, SPRING_CONFIG);
      else {
        top.value = withSpring(0, SPRING_CONFIG);
      }
      runOnJS(sendIsPressed)();
    },
  });

  if (props.isPressed) {
    top.value = withSpring(0, SPRING_CONFIG);
  }

  const {
    data: countries,
    loading: countriesLoading,
    request: loadCountries,
  } = useApi(locationApi.getCountries);

  const {
    data: states,
    loading: statesLoading,
    request: loadStates,
  } = useApi(locationApi.getStates);

  useEffect(async () => {
    loadCountries();
    if (country) loadStates(country);
  }, []);

  const filters = {
    country,
    state,
    city,
    job_type:
      selectedJobType === "internship"
        ? "6130bc87b8eb9a6797043297"
        : selectedJobType === "ft"
        ? "6130bc8cb8eb9a6797043298"
        : null,
    experience,
    skills: skillsItemArray,
    keyword,
  };

  const handleApply = async () => {
    top.value = withSpring(dimensions.height, SPRING_CONFIG);
    sendFilters(filters);
  };

  const FilterItem = (props) => {
    return (
      <TouchableOpacity
        {...props}
        activeOpacity={0.5}
        style={styles.modalListItem}
      >
        <Text style={styles.itemText}>{props.title}</Text>
        <AntDesign
          name={props.isShown ? "minus" : "plus"}
          size={20}
          color={Colors.primary}
        />
      </TouchableOpacity>
    );
  };

  const SkillsFilterItem = skillsItemArray.map((skillItem) => (
    <View
      style={{
        flexDirection: "row",
        borderWidth: 1,
        alignSelf: "flex-start",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#0AB4F14D",
        backgroundColor: "#B9ECFF4D",
        borderRadius: 3,
        marginLeft: 10,
        marginTop: 10,
      }}
    >
      <AppText style={{ marginHorizontal: 5, color: Colors.primary }}>
        {skillItem}
      </AppText>
      <TouchableOpacity
        onPress={() => {
          const index = skillsItemArray.indexOf(skillItem);

          skillsItemArray.splice(index, 1);
        }}
        style={{
          borderWidth: 1,
          margin: 3,
          borderColor: "#0AB4F14D",
          borderRadius: 3,
        }}
      >
        <Feather name="x" size={17} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  ));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.modalContainer, style]}>
        <View style={styles.modalContentContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Filters</Text>
            <View style={styles.buttonContainer}>
              <TouchableNativeFeedback
                onPress={() => {
                  top.value = withSpring(dimensions.height + 50, SPRING_CONFIG);
                  sendIsPressed();
                }}
              >
                <View style={styles.button}>
                  <Feather name="x" size={24} color={Colors.primary} />
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
          <View style={styles.line} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width: "100%" }}
          >
            <FilterItem
              title="Location"
              onPress={() => setIsLocationShown(!isLocationShown)}
              isShown={isLocationShown}
            />
            {isLocationShown && (
              <View
                style={{
                  paddingHorizontal: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <AppPicker
                    selectedItem={country}
                    onSelectItem={(item) => {
                      setCountry(item.name);
                      loadStates(item.name);
                      setState(null);
                    }}
                    name="country"
                    title={country ? country : "Country"}
                    items={countries}
                    loading={countriesLoading}
                    style={{ width: "49%", marginRight: 10 }}
                  />
                  <AppPicker
                    selectedItem={state}
                    onSelectItem={(item) => {
                      setState(item.name);
                    }}
                    name="state"
                    title={state ? state : "State"}
                    items={states ? states[0].states : states}
                    loading={statesLoading}
                    style={{ width: "49%" }}
                  />
                </View>
                <CardInput
                  placeholder="City"
                  onChangeText={(text) => setCity(text)}
                />
              </View>
            )}
            <FilterItem
              title="Job Type"
              onPress={() => setIsJobTypeShown(!isJobTypeShown)}
              isShown={isJobTypeShown}
            />
            {isJobTypeShown && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                  justifyContent: "center",
                }}
              >
                <Card
                  touchable
                  style={{
                    marginHorizontal: 10,
                    justifyContent: "space-evenly",
                    flex: 1,
                  }}
                  onPress={() => {
                    if (selectedJobType === "internship")
                      setSelectedJobType("");
                    else setSelectedJobType("internship");
                  }}
                >
                  <View
                    style={{
                      ...styles.dotContainer,
                      borderColor:
                        selectedJobType === "internship"
                          ? Colors.primary
                          : "#ccc",
                    }}
                  >
                    <View
                      style={{
                        ...styles.dot,
                        backgroundColor:
                          selectedJobType === "internship"
                            ? Colors.primary
                            : "white",
                      }}
                    />
                  </View>
                  <AppText>Internship</AppText>
                </Card>
                <Card
                  onPress={() => {
                    if (selectedJobType === "ft") setSelectedJobType("");
                    else setSelectedJobType("ft");
                  }}
                  touchable
                  style={{
                    flex: 1,
                    marginHorizontal: 10,
                    justifyContent: "space-evenly",
                  }}
                >
                  <View
                    style={{
                      ...styles.dotContainer,
                      borderColor:
                        selectedJobType === "ft" ? Colors.primary : "#ccc",
                    }}
                  >
                    <View
                      style={{
                        ...styles.dot,
                        backgroundColor:
                          selectedJobType === "ft" ? Colors.primary : "white",
                      }}
                    />
                  </View>
                  <AppText>Full Time</AppText>
                </Card>
              </View>
            )}
            <FilterItem
              title="Experience"
              isShown={isExperienceShown}
              onPress={() => setIsExperienceShown(!isExperienceShown)}
            />
            {isExperienceShown && (
              <View style={{ paddingHorizontal: 10 }}>
                <AppPicker
                  selectedItem={experience}
                  onSelectItem={(item) => {
                    setExperience(item.name);
                  }}
                  name="experience"
                  title={experience ? experience : "Select"}
                  items={experienceData}
                />
              </View>
            )}
            <FilterItem
              title="Skills"
              isShown={isSkillsShown}
              onPress={() => setIsSkillsShown(!isSkillsShown)}
            />
            {isSkillsShown && (
              <>
                <CardInput
                  inputStyle={{ marginHorizontal: 10 }}
                  placeholder="Press enter to add"
                  onChangeText={(val) => {
                    setSkillItemText(val);
                  }}
                  onSubmitEditing={() => {
                    setSkillsItemArray([...skillsItemArray, skillItemText]);
                    setSkillItemText("");
                  }}
                  value={skillItemText}
                />
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginBottom: 50,
                  }}
                >
                  {SkillsFilterItem}
                </View>
              </>
            )}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              bottom: Dimensions.get("window").height / 15,
            }}
          >
            <CustomButton
              title="Reset"
              titleStyle={{ color: Colors.primary }}
              style={{
                backgroundColor: "white",
                elevation: 3,
                marginRight: 10,
              }}
              onPress={() => {
                top.value = withSpring(dimensions.height, SPRING_CONFIG);
                setCity();
                setCountry();
                setState();
                setSelectedJobType();
                setExperience();
                setSkillsItemArray([]);
                sendFilters({});
              }}
            />

            <CustomButton
              title="Apply"
              onPress={() => {
                handleApply();
                top.value = withSpring(dimensions.height, SPRING_CONFIG);
                sendFilters();
              }}
            />
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: "hidden",
    position: "absolute",
    right: -15,
  },
  dot: {
    justifyContent: "center",
    alignItems: "center",
    height: 12,
    width: 12,
    overflow: "hidden",
    borderRadius: 6,
    borderColor: "#ccc",
    backgroundColor: "#ccc",
  },
  dotContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 9,
    height: 18,
    width: 18,
  },
  itemText: {
    fontFamily: "OpenSans-Medium",
    fontSize: 16,
    color: Colors.primary,
    marginHorizontal: 7,
  },
  modalListItem: {
    width: "100%",
    flexDirection: "row",
    // borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 7,
    // marginTop: 15,
  },
  headingContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headingText: {
    color: Colors.primary,
    fontSize: 19,
    fontFamily: "OpenSans-SemiBold",
  },
  line: {
    // height: 27,
    width: width,
    height: 1.6,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: "#0AB4F1",
    elevation: 1,
    marginBottom: 10,
    opacity: 0.1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentContainer: {
    backgroundColor: Colors.bg,
    top: Dimensions.get("window").height / 10,
    flex: 1,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    padding: 20,
    alignItems: "center",
  },
  boldText: {
    color: Colors.primary,
    fontSize: 17.5,
    fontFamily: "OpenSans-SemiBold",
    marginLeft: 5,
    // marginBottom: 10,
  },
  container: {
    flex: 1,
    width: "110%",
    paddingBottom: 90,
    marginBottom: 30,
  },
  dateTimeText: {
    color: Colors.primary,
    fontFamily: "OpenSans-SemiBold",
    fontSize: 15,
  },
  text: {
    marginTop: 25,
  },
});

export default FilterModal;
