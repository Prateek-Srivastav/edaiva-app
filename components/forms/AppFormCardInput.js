import React from "react";
import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";
import CardInput from "../CardInput";

function AppFormCardInput({ name, label, ...otherProps }) {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

  return (
    <>
      <CardInput
        label={label ? label : null}
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        {...otherProps}
      />
      <ErrorMessage visible={touched[name]} error={errors[name]} />
    </>
  );
}

export default AppFormCardInput;
