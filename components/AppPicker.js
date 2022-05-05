import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import AppText from "./AppText";
import CustomAlert from "./CustomAlert";
import PickerItem from "./PickerItem";
import Loading from "./Loading";
import showToast from "./ShowToast";

function AppPicker(props) {
  const [visible, setVisible] = useState(false);
  const [selectedItemArray, setSelectedItemArray] = useState(
    Array.isArray(props.selectedItem)
      ? [...props.selectedItem]
      : [props.selectedItem]
  );
  const [selectedItem, setSelectedItem] = useState(
    Array.isArray(props.selectedItem)
      ? [...props.selectedItem]
      : [props.selectedItem]
  );

  const {
    dateTimePicker,
    items,
    onSelectItem,
    onPress,
    disabled,
    multiSelect,
    internship,
  } = props;

  useEffect(() => {
    if (Array.isArray(props.selectedItem))
      setSelectedItemArray(props.selectedItem);
    else setSelectedItem([props.selectedItem]);
  }, []);

  // // console.log(selectedItemArray);
  return (
    <View
      style={{
        ...styles.container,
        // opacity: disabled ? 0.8 : 1,
        ...props.style,
      }}
    >
      {props.label && (
        <AppText
          style={{
            alignSelf: "flex-start",
            fontSize: 13,
            marginVertical: 5,
          }}
        >
          {props.label}
        </AppText>
      )}
      <TouchableOpacity
        // disabled={disabled}
        onPress={() => {
          if (disabled && internship)
            return showToast({
              type: "appInfo",
              message: "Interns doesn't need experience!",
            });
          if (onPress) onPress();
          setVisible(true);
        }}
        activeOpacity={disabled ? 1 : 0.8}
        style={{
          ...styles.picker,
          backgroundColor: disabled ? "#ededed" : "white",
        }}
      >
        <Text style={{ ...styles.title, ...props.titleStyle }}>
          {props.title}
        </Text>
        {props.icon ? (
          props.icon
        ) : (
          <Ionicons
            name={props.isShown ? "chevron-up" : "chevron-down"}
            size={14}
            color={props.iconColor ? props.iconColor : Colors.grey}
          />
        )}
      </TouchableOpacity>
      {dateTimePicker ? null : (
        <CustomAlert modalWidth="90%" visible={visible}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setVisible(false)}
          >
            <Feather name="x" size={18} color={Colors.primary} />
          </TouchableOpacity>
          {props.loading && <Loading />}
          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              if (item.name === null) return;

              return (
                <PickerItem
                  label={item.name}
                  selected={
                    multiSelect ? props.selectedItem : [props.selectedItem]
                  }
                  onPress={() => {
                    if (multiSelect) {
                      // setSelectedItemArray([...selectedItemArray, item.name]);
                      setSelectedItemArray(props.selectedItem);
                      onSelectItem(item);
                    } else if (!multiSelect) {
                      setSelectedItem([item.name]);
                      onSelectItem(item);
                      setVisible(false);
                    }
                  }}
                />
              );
            }}
          />
        </CustomAlert>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 20,
    width: 20,
    top: -10,
    // borderWidth: 1,
    borderColor: "#0AB4F14D",
    borderRadius: 3,
    alignSelf: "flex-end",
  },
  container: {
    flex: 1,
    // width: "100%",
    // borderWidth: 1,
    // borderWidth: 1,
    marginBottom: 10,
    // backgroundColor: "white",
  },
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    backgroundColor: "white",
    borderRadius: 3,
    padding: 10,
    // borderWidth: 1,
    // paddingHorizontal: 10,
  },
  title: {
    color: "#817E7E",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
  },
});

export default AppPicker;
