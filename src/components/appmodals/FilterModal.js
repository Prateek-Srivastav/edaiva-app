import React, { useEffect, useState, useContext, useCallback } from "react";
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
  Switch,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import RangeSlider from "rn-range-slider";
import { Feather, AntDesign } from "@expo/vector-icons";

import AppText from "../AppText";
import Colors from "../../constants/Colors";
import CustomButton from "../CustomButton";
import useApi from "../../hooks/useApi";
import AppPicker from "../AppPicker";
import Card from "../Card";
import CardInput from "../CardInput";
import locationApi from "../../api/location";
import ErrorMessage from "../forms/ErrorMessage";
import Toggle from "../Toggle";
import AuthContext from "../../auth/context";
import Thumb from "../slider/Thumb";
import Rail from "../slider/Rail";
import RailSelected from "../slider/RailSelected";
import Label from "../slider/Label";
import Notch from "../slider/Notch";

const { width, height } = Dimensions.get("screen");

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 600,
};

const experienceData = [
  { _id: 0, name: "All" },
  { _id: 1, name: "0-2 Years" },
  { _id: 2, name: "3-5 Years" },
  { _id: 3, name: "5-10 Years" },
  { _id: 4, name: "10-15 Years" },
  { _id: 5, name: "15+ Years" },
];

function FilterModal(props) {
  const dimensions = useWindowDimensions();

  const [isAllIndiaOn, setIsAllIndiaOn] = useState(false);
  const [isRemoteOn, setIsRemoteOn] = useState(false);
  const [isFreshersJobs, setIsFreshersJobs] = useState(false);
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [city, setCity] = useState();
  const [expTo, setExpTo] = useState(0);
  const [expFrom, setExpFrom] = useState(0);
  const [experience, setExperience] = useState();
  const [salaryFrom, setSalaryFrom] = useState(0);
  const [salaryTo, setSalaryTo] = useState(0);
  const [salary, setSalary] = useState();
  const [keyword, setKeyword] = useState();
  const [isLocationShown, setIsLocationShown] = useState(false);
  const [isJobTypeShown, setIsJobTypeShown] = useState(false);
  const [isSalaryShown, setIsSalaryShown] = useState(false);
  const [isExperienceShown, setIsExperienceShown] = useState(false);
  const [isSkillsShown, setIsSkillsShown] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [skillsItemArray, setSkillsItemArray] = useState([]);
  const [skillItemText, setSkillItemText] = useState();
  const top = useSharedValue(Dimensions.get("screen").height);

  const { setIsTabBarShown } = useContext(AuthContext);

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
    setIsTabBarShown(true);
  };

  if (props.closeFilter) {
    top.value = withSpring(dimensions.height + 50, SPRING_CONFIG);
  }

  const gestureHandler = useAnimatedGestureHandler({
    onStart(_, context) {
      context.startTop = top.value;
    },
    onActive(event, context) {
      top.value = context.startTop + event.translationY;
    },
    onEnd(event) {
      if (event.translationY > 50) {
        top.value = withSpring(dimensions.height + 50, SPRING_CONFIG);
        runOnJS(sendIsPressed)();
      } else {
        top.value = withSpring(0, SPRING_CONFIG);
      }
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
    loadStates("India");
  }, []);

  useEffect(() => {
    if (isFreshersJobs) {
      setExpFrom(0);
      setExpTo(2);
    }
  }, [isFreshersJobs]);

  useEffect(() => {
    if (expTo !== 2 || expFrom !== 0) setIsFreshersJobs(false);
  }, [expTo, expFrom]);

  let filters = {
    country: isAllIndiaOn ? "India" : null,
    state,
    job_type:
      selectedJobType === "internship"
        ? props.jobTypes.filter((type) => type.name === "Internship")[0]._id
        : selectedJobType === "ft"
        ? props.jobTypes.filter((type) => type.name === "Full-time")[0]._id
        : selectedJobType === "pt"
        ? props.jobTypes.filter((type) => type.name === "Part-time")[0]._id
        : null,
    exp_from: isFreshersJobs
      ? 0
      : expTo > 16
      ? 16
      : expTo === 0
      ? null
      : expFrom,
    exp_to: isFreshersJobs ? 2 : expTo > 16 || expTo === 0 ? null : expTo,
    experience,
    salary_from:
      salaryTo > 80 ? 80000 : salaryTo === 0 ? null : salaryFrom * 1000,
    salary_to: salaryTo > 80 || salaryTo === 0 ? null : salaryTo * 1000,
    salary,
    keyword,
    remote: isRemoteOn ? isRemoteOn : null,
    skills: skillsItemArray,
  };

  const handleApply = async () => {
    top.value = withSpring(dimensions.height, SPRING_CONFIG);
    if (
      city === undefined &&
      country === undefined &&
      state === undefined &&
      !selectedJobType &&
      skillsItemArray.length === 0 &&
      (!experience || experience === "0 - 0") &&
      (!keyword || keyword === "") &&
      !isRemoteOn &&
      !isAllIndiaOn &&
      (!salary || salary === "0k - 0k")
    ) {
      console.log("abcd");
      setIsTabBarShown(true);
      return sendFilters({});
    }
    setIsTabBarShown(true);

    sendFilters(filters);
    console.log(filters);
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

          setSkillsItemArray(
            skillsItemArray.filter((item) => item !== skillItem)
          );
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

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  // const renderLabel = useCallback((value) => <Label text={value} />, []);
  // const renderNotch = useCallback(() => <Notch />, []);

  const handleValueChange = useCallback((low, high) => {
    setExpFrom(low);
    setExpTo(high);
    if (high !== 0 && high <= 16) setExperience(low + " - " + high);
    else if (high === 0) setExperience();
    else if (high > 16) setExperience("16+");
  }, []);

  const handleSalaryFilterValueChange = useCallback((low, high) => {
    setSalaryFrom(low);
    setSalaryTo(high);
    if (high !== 0 && high <= 80) setSalary(low + "k - " + high + "k");
    else if (high === 0) setSalary();
    else if (high > 80) setSalary("80k+");
  }, []);

  return (
    <PanGestureHandler
      activeOffsetX={[-10, 10]}
      onGestureEvent={gestureHandler}
    >
      <Animated.View style={[styles.modalContainer, style]}>
        <View style={styles.modalContentContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Filters</Text>
            <View style={styles.buttonContainer}>
              <TouchableNativeFeedback
                onPress={() => {
                  top.value = withSpring(dimensions.height + 50, SPRING_CONFIG);
                  sendIsPressed();
                  setIsTabBarShown(true);
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    // margin: -5,
                    marginBottom: 5,
                  }}
                >
                  <AppText>All India</AppText>
                  <Switch
                    value={isAllIndiaOn}
                    onChange={() => setIsAllIndiaOn(!isAllIndiaOn)}
                    trackColor={{ true: Colors.primary, false: "#ecf0f1" }}
                    thumbColor={Colors.white}
                    style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    // margin: -5,
                    marginBottom: 10,
                  }}
                >
                  <AppText>Remote Only</AppText>
                  <Switch
                    value={isRemoteOn}
                    onChange={() => setIsRemoteOn(!isRemoteOn)}
                    trackColor={{ true: Colors.primary, false: "#ecf0f1" }}
                    thumbColor={Colors.white}
                    style={{
                      transform: [{ scaleX: 1 }, { scaleY: 1 }],
                    }}
                  />
                </View>
                <AppPicker
                  disabled={isAllIndiaOn}
                  selectedItem={state}
                  onSelectItem={(item) => {
                    if (state === item.name) return setState();
                    setState(item.name);
                  }}
                  name="state"
                  title={state ? state : "State"}
                  items={states ? states[0].states : states}
                  loading={statesLoading}
                  style={{ width: "100%" }}
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
              <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <AppText>Freshers Jobs Only</AppText>
                  <Switch
                    value={isFreshersJobs}
                    onChange={() => setIsFreshersJobs(!isFreshersJobs)}
                    trackColor={{ true: Colors.primary, false: "#ecf0f1" }}
                    thumbColor={Colors.white}
                    style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                  />
                </View>
                {expTo !== 0 && (
                  <Text
                    style={{
                      color: Colors.primary,
                      borderColor: "#0AB4F14D",
                      borderWidth: 1,
                      padding: 7,
                      margin: 8,
                      backgroundColor: "#B9ECFF4D",
                      borderRadius: 4,
                      alignSelf: "flex-start",
                    }}
                  >
                    {expTo > 16 ? "16+" : `${expFrom} - ${expTo}`}
                  </Text>
                )}
                <RangeSlider
                  high={expTo}
                  low={expFrom}
                  min={0}
                  max={17}
                  step={2}
                  // floatingLabel
                  renderThumb={renderThumb}
                  renderRail={renderRail}
                  renderRailSelected={renderRailSelected}
                  // renderLabel={renderLabel}
                  // renderNotch={renderNotch}
                  onValueChanged={handleValueChange}
                />
              </View>
            )}
            <FilterItem
              title="Salary"
              isShown={isSalaryShown}
              onPress={() => setIsSalaryShown(!isSalaryShown)}
            />
            {isSalaryShown && (
              <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
                {salaryTo !== 0 && (
                  <Text
                    style={{
                      color: Colors.primary,
                      borderColor: "#0AB4F14D",
                      borderWidth: 1,
                      padding: 7,
                      margin: 8,
                      backgroundColor: "#B9ECFF4D",
                      borderRadius: 4,
                      alignSelf: "flex-start",
                    }}
                  >
                    {salaryTo > 80 ? "80k+" : `${salaryFrom}k - ${salaryTo}k`}
                  </Text>
                )}
                <RangeSlider
                  high={salaryTo}
                  low={salaryFrom}
                  min={0}
                  max={90}
                  step={10}
                  // floatingLabel
                  renderThumb={renderThumb}
                  renderRail={renderRail}
                  renderRailSelected={renderRailSelected}
                  // renderLabel={renderLabel}
                  // renderNotch={renderNotch}
                  onValueChanged={handleSalaryFilterValueChange}
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
                // top.value = withSpring(dimensions.height, SPRING_CONFIG);
                setCity();
                setCountry();
                setState();
                setSelectedJobType();
                setExperience();
                setExpFrom(0);
                setExpTo(0);
                setSalaryFrom(0);
                setSalaryTo(0);
                setSalary(0);
                setSkillsItemArray([]);
                setIsAllIndiaOn();
                setIsRemoteOn();
                // sendFilters({});
              }}
            />
            <CustomButton
              title="Apply"
              onPress={() => {
                handleApply();
                top.value = withSpring(dimensions.height, SPRING_CONFIG);
                // sendFilters();
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
