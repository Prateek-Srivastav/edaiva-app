import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";

import AppPicker from "../../components/AppPicker";
import { AppForm, ErrorMessage, SubmitButton } from "../../components/forms";
import AppFormCardInput from "../../components/forms/AppFormCardInput";
import CardInput from "../../components/CardInput";
import DatePicker from "../../components/DatePicker";
import locationApi from "../../api/location";
import userApi from "../../api/user";
import candidateApi from "../../api/candidate";
import useApi from "../../hooks/useApi";
import { useNavigation } from "@react-navigation/native";
import cache from "../../utilities/cache";
import { formattedDate, formattedNumericDate } from "../../utilities/date";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().label("First Name"),
  lastname: Yup.string().required().label("Last Name"),
  designation: Yup.string().required().label("Designation"),
  city: Yup.string().required().label("City"),
  pincode: Yup.string().required().label("Pincode"),
});

function PersonalDetailsScreen({ data: profileData }) {
  const navigation = useNavigation();

  const {
    address1,
    address2,
    city,
    designation,
    mobile,
    firstname,
    lastname,
    pincode,
    email,
  } = profileData;

  const { usFormat: usFormatDob } = formattedNumericDate(
    profileData.dob?.$date
  ).usFormat;

  const [dob, setDob] = useState(
    profileData.dob?.$date !== "" ? usFormatDob : null
  );
  const [state, setState] = useState(profileData.state);
  const [country, setCountry] = useState(profileData.country);
  const [phone, setPhone] = useState(mobile);
  const [phoneCode, setPhoneCode] = useState();
  const [phoneError, setPhoneError] = useState();
  const [countryError, setCountryError] = useState();
  const [stateError, setStateError] = useState();
  const [dobError, setDobError] = useState();

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
    request: updateProfile,
  } = useApi(candidateApi.updateProfile);

  const {
    // error,
    // loading,
    request: createProfile,
  } = useApi(candidateApi.createProfile);

  useEffect(async () => {
    loadCountries();
    if (country) loadStates(country);
  }, []);

  const handleSubmit = async (values) => {
    const val = {
      ...values,
      mobile: phone,
      state,
      country,
      dob,
      description: "",
    };

    if (!state) return setStateError(true);
    else if (!country) return setCountryError(true);
    else if (!dob) return setDobError(true);
    else if (phone === "" || phone.length < 10) return setPhoneError(true);

    updateUser({
      firstname: values.firstname,
      lastname: values.lastname,
    });

    const user = await cache.get("user");

    cache.store("user", {
      firstname: values.firstname,
      lastname: values.lastname,
      email,
      id: user.id,
    });

    if (!profileData.user) {
      console.log("abcd");
      createProfile(val);
    } else {
      console.log("efgh");
      updateProfile(val);
    }

    navigation.navigate("EditProfile");
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 15 }}
      style={styles.container}
    >
      <AppForm
        initialValues={{
          firstname,
          lastname,
          dob,
          designation,
          address1,
          address2,
          pincode,
          city,
          state,
        }}
        onSubmit={handleSubmit}
        // validationSchema={validationSchema}
      >
        <AppFormCardInput
          defaultValue={firstname !== "" ? firstname : ""}
          name="firstname"
          label="FIRST NAME"
        />
        <AppFormCardInput
          defaultValue={lastname !== "" ? lastname : ""}
          name="lastname"
          label="LAST NAME"
        />

        <AppFormCardInput
          defaultValue={designation !== "" ? designation : ""}
          name="designation"
          label="DESIGNATION"
        />
        <DatePicker
          label="DATE OF BIRTH"
          minDate={null}
          onDateChange={(indFormat, usFormat, date) => {
            console.log(usFormat);
            setDob(usFormat);
            setDobError(false);
          }}
          value={dob}
        />
        <ErrorMessage error="DOB is required" visible={dobError} />

        <AppFormCardInput
          defaultValue={address1 !== "" ? address1 : ""}
          name="address1"
          label="ADDRESS"
          placeholder="Apartment, Landmark"
        />
        <AppFormCardInput
          defaultValue={address2 !== "" ? address2 : ""}
          name="address2"
          placeholder="Street"
        />

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

        <AppFormCardInput
          defaultValue={city !== "" ? city : ""}
          name="city"
          placeholder="City"
        />
        <AppFormCardInput
          defaultValue={pincode?.toString()}
          name="pincode"
          placeholder="Pincode"
        />
        <CardInput
          defaultValue={phoneCode ? phoneCode : phone}
          label="PHONE"
          onChangeText={(text) => {
            setPhone(text);
            setPhoneError(false);
          }}
        />
        <ErrorMessage
          error="Enter a valid phone number."
          visible={phoneError}
        />
        <SubmitButton title="Save" />
      </AppForm>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 15,
    // alignItems: "center",
  },
});

export default PersonalDetailsScreen;
