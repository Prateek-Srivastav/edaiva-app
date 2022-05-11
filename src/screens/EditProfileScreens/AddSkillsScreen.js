import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";

import CardInput from "../../components/CardInput";
import candidateApi from "../../api/candidate";
import Colors from "../../constants/Colors";
import AppText from "../../components/AppText";
import CustomButton from "../../components/CustomButton";
import useApi from "../../hooks/useApi";

function AddSkillsScreen({ data, index }) {
  const navigation = useNavigation();
  if (index >= 0) {
    var { skill_name, level: prevLevel } = data.skills[index];
  }

  const [level, setLevel] = useState(prevLevel ? prevLevel : 0);

  const {
    error,
    loading,
    request: updateProfile,
  } = useApi(candidateApi.updateProfile);

  const [inputs, setInputs] = useState([
    { skill_name: skill_name ? skill_name : "", level },
  ]);

  const addHandler = () => {
    setInputs([...inputs, { skill_name: "", level: "" }]);
  };

  const deleteHandler = (index) => {
    const _inputs = [...inputs];
    _inputs.splice(index, 1);
    setInputs(_inputs);
  };

  const inputHandler = (skill_name, level, index) => {
    const _inputs = [...inputs];
    _inputs[index].skill_name = skill_name;
    _inputs[index].level = level;
    setInputs(_inputs);
    // console.log(_inputs);
  };

  const handleAddSubmit = async () => {
    // const val = {
    //   ...values,
    //   level,
    // };

    let skills;
    if (Array.isArray(data.skills)) skills = [...data.skills, ...inputs];
    else skills = [...inputs];

    console.log(inputs);

    await updateProfile({ skills });
    navigation.goBack();
  };

  const handleEditSubmit = async () => {
    // const val = {
    //   ...values,
    //   level,
    // };

    console.log(inputs[0]);

    const skills = data.skills;
    skills.splice(index, 1, inputs[0]);

    await updateProfile({ skills });
    navigation.goBack();
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          {
            // paddingHorizontal: 20,
          }
        }
        style={styles.container}
      >
        {inputs.map((input, index) => {
          // console.log(input);
          return (
            <>
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // marginVertical: inputs.length > 1 ? -20 : 0,
                    justifyContent: "center",
                    // borderWidth: 1,
                  }}
                >
                  <CardInput
                    name="skill_name"
                    label="Skill"
                    placeholder="Skill"
                    defaultValue={input.skill_name ? input.skill_name : ""}
                    style={{
                      width: inputs.length > 1 ? "85%" : "99%",
                      alignItems: "center",
                      marginRight: inputs.length > 1 ? 10 : 0,
                      marginStart: inputs.length > 1 ? 2 : 0,
                    }}
                    onChangeText={(text) => {
                      inputHandler(text, input.level, index);
                    }}
                  />

                  {inputs.length > 1 && (
                    <CustomButton
                      title="-"
                      style={{
                        alignSelf: "flex-end",
                        marginVertical: 10,
                      }}
                      onPress={() => deleteHandler(index)}
                    />
                  )}
                </View>
                <AppText style={{ marginTop: 15 }}>
                  How would you rate yourself in “That skill”.
                </AppText>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <AppText
                    style={{
                      textAlign: "right",
                      fontFamily: "OpenSans-Bold",
                      color: Colors.primary,
                      fontSize: 16,
                      marginBottom: 4,
                    }}
                  >
                    {input.level}
                  </AppText>
                  <AppText style={{ fontSize: 16 }}> /10</AppText>
                </View>
                <Slider
                  style={{ width: "100%", marginTop: 10 }}
                  minimumTrackTintColor={Colors.primary}
                  maximumTrackTintColor={Colors.primary}
                  thumbTintColor={Colors.primary}
                  minimumValue={0}
                  maximumValue={10}
                  value={parseInt(level)}
                  onValueChange={(val) =>
                    inputHandler(input.skill_name, parseInt(val), index)
                  }
                />
              </>

              {inputs.length > 1 && inputs.length !== index + 1 && (
                <View
                  style={[
                    styles.line,
                    {
                      width: "70%",
                      backgroundColor: Colors.grey,
                      opacity: 0.1,
                      alignSelf: "center",
                    },
                  ]}
                />
              )}
            </>
          );
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 20,
        }}
      >
        {!(index >= 0) && (
          <CustomButton
            title="+ Add another"
            titleStyle={{ color: Colors.primary }}
            style={{
              backgroundColor: "white",
              elevation: 3,
              marginRight: 10,
            }}
            onPress={() => {
              addHandler();
            }}
          />
        )}

        <CustomButton
          title={index >= 0 ? "Save" : "Add"}
          onPress={() => {
            if (index >= 0) return handleEditSubmit();
            else return handleAddSubmit();
            // sendFilters();
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  line: {
    height: 1.6,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: "#0AB4F1",
    elevation: 1,
    marginVertical: 10,
    opacity: 0.1,
  },
});

export default AddSkillsScreen;
