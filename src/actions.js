import { graphql, formatQuery, formatPageQueryWithCount } from "@openimis/fe-core";

export function fetchInsuree(mm, chfid) {
  let payload = formatQuery("insuree",
    [`chfId:"${chfid}"`],
    ["chfId", "lastName", "otherNames", "dob", "age",
      "family{id}",
      "photo{folder,filename}",
      "gender{code, gender, altLanguage}",
      "healthFacility{"+mm.getProjection("location.HealthFacilityPicker.projection").join(",")+"}"]
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