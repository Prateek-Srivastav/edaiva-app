import Toast from "react-native-toast-message";

function showToast({ type, message }) {
  return Toast.show({
    type: type,
    text1: message,
  });
}

export default showToast;
