import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";

import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import CustomButton from "./CustomButton";
import AppPicker from "./AppPicker";
import AppText from "./AppText";
import Card from "./Card";
import CardInput from "./CardInput";

function FilterModalContent(props) {
  const [isLocationShown, setIsLocationShown] = useState(false);
  const [isJobTypeShown, setIsJobTypeShown] = useState(false);
  const [isSkillsShown, setIsSkillsShown] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [skillsItemArray, setSkillsItemArray] = useState([]);
  const [skillItemText, setSkillItemText] = useState();

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
    <ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
      <FilterItem
        title="Location"
        onPress={() => setIsLocationShown(!isLocationShown)}
        isShown={isLocationShown}
      />
      {isLocationShown && (
        <View
          style={{
            // padding: 10,
            // borderWidth: 1,
            paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <AppPicker
            icon={<Ionicons name="chevron-down" size={17} color="#817E7E" />}
            title="All Countries"
          />
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <AppPicker
              icon={<Ionicons name="chevron-down" size={17} color="#817E7E" />}
              title="All States"
              style={{ width: "49%" }}
            />
            <AppPicker
              icon={<Ionicons name="chevron-down" size={17} color="#817E7E" />}
              title="City"
              style={{ width: "49%" }}
            />
          </View>
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
              if (selectedJobType === "internship") setSelectedJobType("");
              else setSelectedJobType("internship");
            }}
          >
            <View
              style={{
                ...styles.dotContainer,
                borderColor:
                  selectedJobType === "internship" ? Colors.primary : "#ccc",
              }}
            >
              <View
                style={{
                  ...styles.dot,
                  backgroundColor:
                    selectedJobType === "internship" ? Colors.primary : "white",
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
                borderColor: selectedJobType === "ft" ? Colors.primary : "#ccc",
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
      <FilterItem title="Experience" />
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
  );
}

const styles = StyleSheet.create({
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
});

export default FilterModalContent;
