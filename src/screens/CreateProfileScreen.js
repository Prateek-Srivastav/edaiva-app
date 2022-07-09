import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";

import AppPicker from "../components/AppPicker";
import { AppForm, ErrorMessage, SubmitButton } from "../components/forms";
import AppFormCardInput from "../components/forms/AppFormCardInput";
import CardInput from "../components/CardInput";
import DatePicker from "../components/DatePicker";
import locationApi from "../api/location";
import userApi from "../api/user";
import candidateApi from "../api/candidate";
import useApi from "../hooks/useApi";
import { useNavigation } from "@react-navigation/native";
import cache from "../utilities/cache";
import { formattedDate, formattedNumericDate } from "../utilities/date";
import CustomHeader from "../components/CustomHeader";
import Colors from "../constants/Colors";
import showToast from "../components/ShowToast";
import AuthContext from "../auth/context";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().label("First Name"),
  lastname: Yup.string().required().label("Last Name"),
  designation: Yup.string().required().label("Designation"),
  city: Yup.string().required().label("City"),
  pincode: Yup.string().required().label("Pincode"),
});

function CreateProfileScreen({ route }) {
  const navigation = useNavigation();

  const getUser = async () => {
    const user = await cache.get("user");
    return setUser(user);
  };

  const [dob, setDob] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [phone, setPhone] = useState();
  const [phoneCode, setPhoneCode] = useState();
  const [dobError, setDobError] = useState();
  const [countryError, setCountryError] = useState();
  const [stateError, setStateError] = useState();
  const [pincodeError, setPincodeError] = useState();
  const [phoneError, setPhoneError] = useState();
  const [user, setUser] = useState();

  const { setIsProfileComplete, setFullName, setIsTabBarShown } =
    useContext(AuthContext);

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

  const {
    error: userUpdateError,
    loading: userUpdateLoading,
    request: updateUser,
  } = useApi(userApi.updateUser);

  const {
    error,
    loading,
    networkError,
    request: createProfile,
  } = useApi(candidateApi.createProfile);

  useEffect(() => {
    setIsTabBarShown(false);
    loadCountries();
    getUser();
    if (route.params.screenName === "Preference")
      showToast({
        type: "appInfo",
        message: `First create profile to set Preferences.`,
      });

    if (country) loadStates(country);
  }, []);

  const handleSubmit = async (values) => {
    if (dobError || stateError || countryError || pincodeError || phoneError)
      showToast({
        type: "appWarning",
        message: `${dobError ? "DOB " : ""} ${stateError ? "State " : ""} ${
          countryError ? "Country " : ""
        } ${pincodeError ? "Pincode " : ""} ${
          phoneError ? "Phone " : ""
        } - required.`,
      });

    const val = {
      ...values,
      mobile: phone,
      state,
      country,
      dob,
      description: "",
    };

    if (!dob) {
      showToast({
        type: "appError",
        message: `DOB is required.`,
      });
      return setDobError(true);
    }
    if (!country) {
      showToast({
        type: "appError",
        message: `Country is required.`,
      });
      return setCountryError(true);
    }
    if (!state) {
      showToast({
        type: "appError",
        message: `State is required.`,
      });
      return setStateError(true);
    }
    if (isNaN(values.pincode)) {
      showToast({
        type: "appError",
        message: `Pincode is required.`,
      });
      return setPincodeError(true);
    }
    if (phone === "") {
      return showToast({
        type: "appError",
        message: `Phone is required.`,
      });
    } else if (
      (country === "India" ? phone.length !== 13 : 0) ||
      phone.includes(" ") ||
      phone.includes("-") ||
      phone.includes(",")
    )
      return setPhoneError(true);

    await updateUser({
      firstname: values.firstname !== "" ? values.firstname : user.firstname,
      lastname: values.lastname !== "" ? values.lastname : user.lastname,
    });

    await cache.store("user", {
      firstname: values.firstname !== "" ? values.firstname : user.firstname,
      lastname: values.lastname !== "" ? values.lastname : user.lastname,
      email: user.email,
      id: user.id,
    });

    await createProfile(val);

    if (!loading && !error && !networkError) setIsProfileComplete(true);

    if (values.firstname !== "")
      setFullName(values.firstname + " " + values.lastname);

    setIsTabBarShown(true);

    if (route?.params.screenName === "JobDetails") return navigation.goBack();
    else if (route.params.screenName === "Preference")
      return navigation.navigate("Preference");
    else if (route.params.screenName === "ProfileStack") {
      return navigation.navigate("ProfileStack");
    } else navigation.goBack();
  };

  return (
    <>
      <CustomHeader
        navigation={navigation}
        backScreen={route.params.screenName === "ProfileStack" ? "Home" : null}
        goBack={route.params.screenName === "ProfileStack" ? false : true}
        screenName="Create Profile"
      />

      <ScrollView
        contentContainerStyle={{ padding: 15 }}
        style={styles.container}
      >
        <AppForm
          initialValues={{
            firstname: "",
            lastname: "",
            dob: "",
            designation: "",
            address1: "",
            address2: "",
            pincode: "",
            city: "",
            state: "",
          }}
          onSubmit={handleSubmit}
          // validationSchema={validationSchema}
        >
          <AppFormCardInput
            defaultValue={user?.firstname}
            name="firstname"
            label="FIRST NAME"
          />
          <AppFormCardInput
            defaultValue={user?.lastname}
            name="lastname"
            label="LAST NAME"
          />

          <AppFormCardInput name="designation" label="DESIGNATION" />
          <DatePicker
            label="DATE OF BIRTH"
            minDate={null}
            maxDate={Date.now()}
            initialDate={dob}
            dobLimit
            onDateChange={(indFormat, usFormat, date) => {
              const dob = new Date(usFormat);
              const diff = Date.now() - dob.getTime();
              const age = new Date(diff);
              const isValid = Math.abs(age.getUTCFullYear() - 1970) >= 16;

              if (!isValid) {
                setDob(null);
                setDobError(false);

                return showToast({
                  type: "appError",
                  message: "Your age must be greater than 16.",
                });
              } else {
                setDob(usFormat);
                setDobError(false);
              }
            }}
            value={dob}
          />
          <ErrorMessage error="DOB is required" visible={dobError} />

          <AppFormCardInput
            name="address1"
            label="ADDRESS"
            placeholder="Apartment, Landmark"
          />
          <AppFormCardInput name="address2" placeholder="Street" />

          <AppPicker
            selectedItem={country}
            onSelectItem={(item) => {
              setCountry(item.name);
              setCountryError(false);
              loadStates(item.name);
              setState(null);
              setPhone(`+${item.phone_code}`);
              setPhoneCode(`+${item.phone_code}`);
            }}
            name="country"
            title={country ? country : "Country"}
            items={countries}
            loading={countriesLoading}
          />
          <ErrorMessage error="Country is required" visible={countryError} />

          <AppPicker
            selectedItem={state}
            onSelectItem={(item) => {
              setState(item.name);
              setStateError(false);
            }}
            name="state"
            title={state ? state : "State"}
            items={states ? states[0].states : states}
            loading={statesLoading}
          />
          <ErrorMessage error="State is required" visible={stateError} />
          <AppFormCardInput name="city" placeholder="City" />
          <AppFormCardInput name="pincode" placeholder="Pincode" />
          <ErrorMessage error="Enter a valid pincode." visible={pincodeError} />
          <CardInput
            defaultValue={phoneCode ? phoneCode : phone}
            label="PHONE"
            onChangeText={(text) => {
              setPhone(text);
              setPhoneError(false);
            }}
            placeholder="Phone"
          />
          <ErrorMessage
            error="Enter a valid phone number."
            visible={phoneError}
          />
          <SubmitButton disabled={loading} title="Save" />
        </AppForm>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: Colors.bg,
  },
});

export default CreateProfileScreen;
