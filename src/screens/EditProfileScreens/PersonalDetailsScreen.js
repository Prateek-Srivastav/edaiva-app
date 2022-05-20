import React, { useContext, useEffect, useState } from "react";
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
import showToast from "../../components/ShowToast";
import AuthContext from "../../auth/context";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().label("First Name"),
  lastname: Yup.string().required().label("Last Name"),
  designation: Yup.string().required().label("Designation"),
  city: Yup.string().required().label("City"),
  pincode: Yup.string().required().label("Pincode"),
});

function PersonalDetailsScreen({ data: profileData, isCampus }) {
  const navigation = useNavigation();
  // // console.log(navigation.getState());

  if (isCampus && profileData.profile) {
    var { firstname, lastname } = profileData;

    var { address1, address2, city, designation, mobile, pincode } =
      profileData.profile;
  } else if (profileData) {
    var {
      address1,
      address2,
      city,
      designation,
      mobile,
      firstname,
      lastname,
      pincode,
    } = profileData;
  }

  const getUser = async () => {
    const user = await cache.get("user");
    return setUser(user);
  };

  const { usFormat: usFormatDob } = formattedNumericDate(
    isCampus ? profileData.profile?.dob : profileData?.dob?.$date
  );

  const [dob, setDob] = useState(
    usFormatDob !== "NaN-NaN-NaN" ? usFormatDob : null
  );
  const [state, setState] = useState(
    isCampus ? profileData.profile?.state : profileData?.state
  );
  const [country, setCountry] = useState(
    isCampus ? profileData.profile?.country : profileData?.country
  );
  const [phone, setPhone] = useState(mobile);
  const [phoneCode, setPhoneCode] = useState();
  const [phoneError, setPhoneError] = useState();
  const [pincodeError, setPincodeError] = useState(false);
  const [countryError, setCountryError] = useState();
  const [stateError, setStateError] = useState();
  const [dobError, setDobError] = useState();
  const [user, setUser] = useState();

  const { setFullName } = useContext(AuthContext);

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

  useEffect(() => {
    loadCountries();
    getUser();

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
    else if (phone === "") {
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
    else if (isNaN(values.pincode)) return setPincodeError(true);

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

    if (values.firstname !== "")
      setFullName(values.firstname + " " + values.lastname);

    if (
      (isCampus && !profileData.profile?.user) ||
      (!isCampus && !profileData?.user)
    ) {
      // console.log("abcd");
      await createProfile(val);
      return navigation.navigate("ProfileStack");
    } else {
      // console.log("efgh");
      await updateProfile(val);
      return navigation.goBack();
    }
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
          defaultValue={firstname ? firstname : user?.firstname}
          name="firstname"
          label="FIRST NAME"
        />
        <AppFormCardInput
          defaultValue={lastname ? lastname : user?.lastname}
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
          maxDate={new Date()}
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
          keyboardType="numeric"
          name="pincode"
          placeholder="Pincode"
        />
        <ErrorMessage error="Enter a valid pincode." visible={pincodeError} />
        <CardInput
          defaultValue={phoneCode ? phoneCode : phone}
          label="PHONE"
          keyboardType="numeric"
          onChangeText={(text) => {
            setPhone(text);
            setPhoneError(false);
          }}
        />
        <ErrorMessage
          error="Enter a valid phone number."
          visible={phoneError}
        />
        <SubmitButton disabled={loading} title="Save" />
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
