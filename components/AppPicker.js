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
  } = props;

  useEffect(() => {
    if (Array.isArray(props.selectedItem))
      setSelectedItemArray(props.selectedItem);
    else setSelectedItem([props.selectedItem]);
  }, []);

  console.log(selectedItemArray);
  return (
    <View
      style={{
        ...styles.container,
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
        disabled={disabled}
        onPress={() => {
          if (onPress) onPress();
          setVisible(true);
        }}
        activeOpacity={0.8}
        style={styles.picker}
      >
        <Text style={{ ...styles.title, ...props.titleStyle }}>
          {props.title}
        </Text>
        {props.icon ? (
          props.icon
        ) : (
          <Ionicons
            name={props.isShown ? "chevron-up" : "chevron-down"}
            size={17}
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
            <Feather name="x" size={24} color={Colors.black} />
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
                  selected={multiSelect ? selectedItemArray : selectedItem}
                  onPress={() => {
                    if (multiSelect) {
                      setSelectedItemArray([...selectedItemArray, item.name]);
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
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    top: -10,
  },
  container: {
    // width: "100%",
    flex: 1,
    // borderWidth: 1,
    marginBottom: 10,
  },
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    backgroundColor: "white",
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    color: "#817E7E",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
  },
});

export default AppPicker;
