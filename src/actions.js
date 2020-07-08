import { graphql, formatQuery, formatPageQueryWithCount } from "@openimis/fe-core";

export function fetchInsuree(mm, chfid) {
  let payload = formatQuery("insuree",
    [`chfId:"${chfid}"`],
    ["id", "chfId", "lastName", "otherNames", "dob", "age",
      "family{id}",
      "photo{folder,filename}",
      "gender{code, gender, altLanguage}",
      "healthFacility" + mm.getProjection("location.HealthFacilityPicker.projection")]
  );
  return graphql(payload, 'INSUREE_ENQUIRY');
}

export function fetchInsurees(mm, filters) {
  let payload = formatPageQueryWithCount("insurees",
    filters,
    mm.getRef("insuree.InsureePicker.projection")
  );
  return graphql(payload, 'INSUREE_INSUREES');
}

export function fetchInsureeFamily(mm, chfid) {
  let payload = formatQuery("insureeFamilyMembers",
    [`chfId:"${chfid}"`],
    ["chfId", "otherNames", "lastName", "head", "phone"]
  );
  return graphql(payload, 'INSUREE_FAMILY');
}

export function fetchFamilySummaries(mm, filters) {
  var projections = [
    "id", "uuid", "poverty", "confirmationNo", "validityFrom", "validityTo",
    "headInsuree{id,uuid,chfId,lastName,otherNames,email,phone,dob}",
    "location" + mm.getProjection("location.Location.FlatProjection")]
  const payload = formatPageQueryWithCount("families",
    filters,
    projections
  );
  return graphql(payload, 'INSUREE_FAMILY_SEARCHER');
}