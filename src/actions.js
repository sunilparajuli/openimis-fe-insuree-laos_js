import {
  graphql, formatQuery, formatPageQuery, formatPageQueryWithCount,
  formatJsonField, decodeId, formatMutation
} from "@openimis/fe-core";

const FAMILY_FULL_PROJECTION = mm => [
  "id", "uuid", "poverty", "confirmationNo", "confirmationType{code}", "familyType{code}", "address",
  "validityFrom", "validityTo",
  "headInsuree{id,uuid,chfId,lastName,otherNames,email,phone,dob}",
  "location" + mm.getProjection("location.Location.FlatProjection")
];

export function fetchInsureeGenders() {
  const payload = formatQuery("insureeGenders",
    null,
    ["code"]
  );
  return graphql(payload, 'INSUREE_GENDERS');
}

export function fetchInsuree(mm, chfid) {
  let payload = formatPageQuery("insurees",
    [`chfId:"${chfid}"`],
    ["id", "uuid", "chfId", "lastName", "otherNames", "dob", "age",
      `family{id}`,
      "photo{folder,filename}",
      "gender{code, gender, altLanguage}",
      "healthFacility" + mm.getProjection("location.HealthFacilityPicker.projection")]
  );
  return graphql(payload, 'INSUREE_INSUREE');
}

export function fetchInsureeFull(mm, uuid) {
  let payload = formatPageQuery("insurees",
    [`uuid:"${uuid}"`],
    ["id", "uuid", "chfId", "lastName", "otherNames", "dob", "age",
      `family{${FAMILY_FULL_PROJECTION(mm).join(",")}}`,
      "photo{folder,filename}",
      "gender{code, gender, altLanguage}",
      "education{id}",
      "profession{id}",
      "currentVillage" + mm.getProjection("location.Location.FlatProjection"),
      "currentAddress",
      "typeOfId{code}", "passport",
      "healthFacility" + mm.getProjection("location.HealthFacilityPicker.projection")]
  );
  return graphql(payload, 'INSUREE_INSUREE');
}

export function fetchInsureesForPicker(mm, filters) {
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
  let projections = [
    "id", "uuid", "poverty", "confirmationNo", "validityFrom", "validityTo",
    "headInsuree{id,uuid,chfId,lastName,otherNames,email,phone,dob}",
    "location" + mm.getProjection("location.Location.FlatProjection")]
  const payload = formatPageQueryWithCount("families",
    filters,
    projections
  );
  return graphql(payload, 'INSUREE_FAMILIES');
}

export function fetchFamilyMembers(mm, filters) {
  let projections = ["uuid", "chfId", "otherNames", "lastName", "head", "phone", "gender{code}", "dob", "cardIssued"];
  const payload = formatPageQueryWithCount("familyMembers",
    filters,
    projections
  );
  return graphql(payload, 'INSUREE_FAMILY_MEMBERS');
}

export function selectFamilyMember(member) {
  return dispatch => {
    dispatch({ type: 'INSUREE_FAMILY_MEMBER', payload: member })
  }
}

export function fetchConfirmationTypes() {
  const payload = formatQuery("confirmationTypes",
    null,
    ["code"]
  );
  return graphql(payload, 'INSUREE_CONFIRMATION_TYPES');
}

export function fetchFamilyTypes() {
  const payload = formatQuery("familyTypes",
    null,
    ["code"]
  );
  return graphql(payload, 'INSUREE_FAMILY_TYPES');
}

export function newFamily() {
  return dispatch => {
    dispatch({ type: 'INSUREE_FAMILY_NEW' })
  }
}

export function fetchFamily(mm, familyUuid, headInsureeChfId) {
  let filters = []
  if (!!familyUuid) {
    filters.push(`uuid: "${familyUuid}"`, "showHistory: true")
  } else {
    filters.push(`headInsuree_ChfId: "${headInsureeChfId}"`)
  }
  const payload = formatPageQueryWithCount("families",
    filters,
    FAMILY_FULL_PROJECTION(mm)
  );
  return graphql(payload, 'INSUREE_FAMILY_OVERVIEW');
}

export function fetchEducations(mm) {
  const payload = formatQuery("educations",
    null,
    ["id"]
  );
  return graphql(payload, 'INSUREE_EDUCATIONS');
}

export function fetchProfessions(mm) {
  const payload = formatQuery("professions",
    null,
    ["id"]
  );
  return graphql(payload, 'INSUREE_PROFESSIONS');
}

export function fetchIdentificationTypes(mm) {
  const payload = formatQuery("identificationTypes",
    null,
    ["code"]
  );
  return graphql(payload, 'INSUREE_IDENTIFICATION_TYPES');
}

export function fetchInsureeSummaries(mm, filters) {
  var projections = [
    "id", "uuid", "validityFrom", "validityTo",
    "chfId", "otherNames", "lastName", "phone", "gender{code}", "dob", "marital",
    "family{uuid}",
    "currentVillage" + mm.getProjection("location.Location.FlatProjection")]
  const payload = formatPageQueryWithCount("insurees",
    filters,
    projections
  );
  return graphql(payload, 'INSUREE_INSUREES');
}

export function formatInsureeGQL(mm, insuree) {
  return `
    ${insuree.uuid !== undefined && insuree.uuid !== null ? `uuid: "${insuree.uuid}"` : ''}
    ${!!insuree.chfId ? `chfId: "${insuree.chfId}"` : ""}
    ${!!insuree.lastName ? `lastName: "${insuree.lastName}"` : ""}
    ${!!insuree.otherNames ? `otherNames: "${insuree.otherNames}"` : ""}
    ${!!insuree.genderCode ? `genderCode: "${insuree.genderCode}"` : ""}
    ${!!insuree.dob ? `dob: "${insuree.dob}"` : ''}
    head: ${!!insuree.head}
    ${!!insuree.marital ? `marital: "${insuree.marital}"` : ""}
    ${!!insuree.passport ? `passport: "${insuree.passport}"` : ""}
    ${!!insuree.phone ? `phone: "${insuree.phone}"` : ""}
    ${!!insuree.email ? `email: "${insuree.email}"` : ""}
    ${!!insuree.currentAddress ? `currentAddress: "${insuree.currentAddress}"` : ""}
    ${!!insuree.currentVillageId ? `currentVillageId: ${decodeId(insuree.currentVillageId)}` : ""}
    ${!!insuree.photoId ? `photoId: ${decodeId(insuree.photoId)}` : ""}
    ${!!insuree.photoDate ? `photoDate: "${insuree.photoDate}"` : ""}
    cardIssued:${!!insuree.cardIssued}
    ${!!insuree.professionId ? `professionId: ${decodeId(insuree.professionId)}` : ""}
    ${!!insuree.educationId ? `educationId: ${decodeId(insuree.educationId)}` : ""}
    ${!!insuree.typeOfIdCode ? `typeOfIdCode: "${insuree.typeOfIdCode}"` : ""}
    ${!!insuree.healthFacilityId ? `healthFacilityId: ${decodeId(insuree.healthFacilityId)}` : ""}
    ${!!insuree.jsonExt ? `jsonExt: ${formatJsonField(insuree.jsonExt)}` : ""}
  `
}

export function formatFamilyGQL(mm, family) {
  return `  
    ${family.uuid !== undefined && family.uuid !== null ? `uuid: "${family.uuid}"` : ''}
    headInsuree: {
      ${formatInsureeGQL(mm, family.headInsuree)}
    }
    ${!!family.locationId ? `locationId: ${decodeId(family.locationId)}` : ""}
    poverty: ${!!family.poverty}
    ${!!family.familyTypeId ? `familyTypeId: ${decodeId(family.familyTypeId)}` : ""}
    ${!!family.address ? `address: "${family.address}"` : ""}
    ${!!family.confirmationTypeId ? `confirmationTypeId: ${decodeId(family.confirmationTypeId)}` : ""}
    ${!!family.confirmationNo ? `confirmationNo: "${family.confirmationTypeNo}"` : ""}
    ${!!family.jsonExt ? `jsonExt: ${formatJsonField(family.jsonExt)}` : ""}
  `
}

export function createFamily(mm, family, clientMutationLabel) {
  let mutation = formatMutation("createFamily", formatFamilyGQL(mm, family), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['INSUREE_MUTATION_REQ', 'INSUREE_CREATE_FAMILY_RESP', 'INSUREE_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function updateFamily(mm, family, clientMutationLabel) {
}