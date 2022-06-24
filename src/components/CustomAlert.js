import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Button,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";

const CustomAlert = ({
  visible,
  children,
  modalWidth,
  modalStyle,
  setAlertVisible,
}) => {
  const [showModal, setShowModal] = useState(visible);

  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    toggleModal();
  }, [visible]);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 160);
      // setShowModal(false);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Modal
        transparent
        visible={showModal}
        onRequestClose={() => {
          setAlertVisible(false);
          setShowModal(false);
        }}
      >
        <TouchableOpacity
          style={{
            height: "100%",
          }}
          onPress={() => {
            setAlertVisible(false);
            setShowModal(false);
          }}
          activeOpacity={1}
        >
          <View style={styles.modalBackGround}>
            <Animated.View
              style={[
                styles.modalContainer,
                { width: modalWidth ? modalWidth : "80%" },
                { transform: [{ scale: scaleValue }] },
                modalStyle,
              ]}
            >
              <TouchableOpacity
                // onPress={() => console.log("ignore me")}
                activeOpacity={1}
              >
                {children}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 4,
    marginVertical: 30,
    elevation: 20,
  },
});

export default CustomAlert;
