import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Yup from "yup";

import AppPicker from "../../components/AppPicker";
import {
  AppForm,
  AppFormCardInput,
  ErrorMessage,
  SubmitButton,
} from "../../components/forms";
import AppText from "../../components/AppText";
import Colors from "../../constants/Colors";
import DatePicker from "../../components/DatePicker";
import useApi from "../../hooks/useApi";
import candidateApi from "../../api/candidate";
import { formattedDate, formattedNumericDate } from "../../utilities/date";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().label("Title"),
  link: Yup.string().url().label("Link"),
  certificate_id: Yup.string().required().label("Certificate ID"),
  issued_by: Yup.string().required().label("Organization name"),
});

function AddCertificationsScreen({ data, index }) {
  const navigation = useNavigation();

  if (index >= 0) {
    var {
      certificate_id,
      issued_by,
      lifetimeValidity: prevLifetimeValidity,
      issue_date,
      end_date,
      link,
      title,
    } = data.certifications[index];
  }

  const [lifetimeValidity, setLifetimeValidity] = useState(
    prevLifetimeValidity ? prevLifetimeValidity : false
  );

  const [issuedDate, setIssuedDate] = useState(
    issue_date ? formattedDate(issue_date) : null
  );
  const [issuedDateError, setIssuedDateError] = useState(false);
  const [endDate, setEndDate] = useState(
    end_date ? formattedDate(end_date) : null
  );

  const { request: updateProfile } = useApi(candidateApi.updateProfile);

  const handleAddSubmit = (values) => {
    const val = {
      ...values,
      lifetimeValidity,
      end_date: lifetimeValidity ? "" : endDate,
      issue_date: issuedDate,
    };

    let certifications;

    if (data.certifications) {
      certifications = [...data.certifications, val];
    } else if (!data.certifications) {
      certifications = [val];
    }

    updateProfile({ certifications });
    navigation.goBack();
  };

  const handleEditSubmit = (values) => {
    const val = {
      ...values,
      lifetimeValidity,
      end_date: lifetimeValidity ? "" : endDate,
      issue_date: issuedDate,
    };

    const certifications = data.certifications;
    certifications.splice(index, 1, val);

    updateProfile({ certifications });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AppForm
        initialValues={{
          title: title ? title : "",
          link: link ? link : "",
          certificate_id: certificate_id ? certificate_id : "",
          issued_by: issued_by ? issued_by : "",
        }}
        validationSchema={validationSchema}
        onSubmit={index >= 0 ? handleEditSubmit : handleAddSubmit}
      >
        <AppFormCardInput
          name="title"
          defaultValue={title ? title : ""}
          label="Title"
          placeholder="xyz"
        />
        <AppFormCardInput
          name="issued_by"
          defaultValue={issued_by ? issued_by : ""}
          label="Issued by"
          placeholder="Organization"
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <DatePicker
            initialDate={issuedDate}
            style={{ width: "49%", marginRight: 7 }}
            label="From"
            minDate={null}
            onDateChange={(date, timestamp) => {
              setIssuedDate(timestamp);
              setIssuedDateError(false);
            }}
            value={
              issuedDate ? formattedNumericDate(issuedDate).usFormat : null
            }
          />

          <DatePicker
            initialDate={endDate}
            style={{ width: "49%" }}
            label="To"
            minDate={null}
            onDateChange={(date, timestamp) => {
              setEndDate(timestamp);
            }}
            disabled={lifetimeValidity}
            value={endDate ? formattedNumericDate(endDate).usFormat : null}
          />
        </View>
        <ErrorMessage
          error="Start date is required"
          visible={issuedDateError}
        />
        <TouchableOpacity
          activeOpacity={0.4}
          style={styles.box}
          onPress={() => setLifetimeValidity(!lifetimeValidity)}
        >
          <View
            style={{
              borderWidth: 1,
              borderRadius: 3,
              borderColor: Colors.primary,
              height: 15,
              width: 15,
              marginRight: 5,
              backgroundColor: lifetimeValidity
                ? Colors.primary
                : "transparent",
            }}
          />
          <AppText>Lifetime</AppText>
        </TouchableOpacity>
        <AppFormCardInput
          name="certificate_id"
          defaultValue={certificate_id ? certificate_id : ""}
          label="Certficate ID"
          placeholder="xyz"
        />
        <AppFormCardInput
          name="link"
          defaultValue={link ? link : ""}
          label="Certificate Link"
          placeholder="Paste link here"
        />

        <SubmitButton title={index >= 0 ? "Save" : "Add"} />
      </AppForm>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 5,
  },
  container: {
    padding: 15,
  },
});

export default AddCertificationsScreen;
