import React from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";
import { INSUREE_GROUP_STATUS } from "../constants";

const InsureeGroupPicker = (props) => {
  return <ConstantBasedPicker module="insuree" label="insureeGroup" constants={INSUREE_GROUP_STATUS} {...props} />;
};

export default InsureeGroupPicker;
