import React from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";
import { INSUREE_RELATIONSHIP } from "../constants";

const InsureeRelationshipPicker = (props) => {
  return <ConstantBasedPicker module="insuree" label="Relationship" constants={INSUREE_RELATIONSHIP} {...props} />;
};

export default InsureeRelationshipPicker;
