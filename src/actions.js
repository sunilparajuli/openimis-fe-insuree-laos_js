import {
  graphql, formatQuery, formatPageQuery, formatPageQueryWithCount,
  formatJsonField, decodeId, formatMutation
} from "@openimis/fe-core";

const FAMILY_HEAD_PROJECTION = "headInsuree{id,uuid,chfId,lastName,otherNames,email,phone,dob,gender{code}}";

const FAMILY_FULL_PROJECTION = mm => [
  "id", "uuid", "poverty", "confirmationNo", "confirmationType{code}", "familyType{code}", "address",
  "validityFrom", "validityTo",
  FAMILY_HEAD_PROJECTION,
  "location" + mm.getProjection("location.Location.FlatProjection"),
  "clientMutationId"
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
      "gender{code}",
      `family{id}`,
      "photo{folder,filename,photo}",
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
      `photo{id,uuid,date,folder,filename,officerId,photo}`,
      "gender{code}",
      "education{id}",
      "profession{id}",
      "currentVillage" + mm.getProjection("location.Location.FlatProjection"),
      "currentAddress",
      "typeOfId{code}", "passport",
      "relationship{id}",
      "head",
      "healthFacility" + mm.getProjection("location.HealthFacilityPicker.projection")],
    "clientMutationId"
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

export function fetchFamilySummaries(mm, filters) {
  let projections = [
    "id", "uuid", "poverty", "confirmationNo", "validityFrom", "validityTo",
    FAMILY_HEAD_PROJECTION,
    "location" + mm.getProjection("location.Location.FlatProjection"),
    "clientMutationId"]
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

export function fetchInsureeOfficers(mm) {
  const payload = formatPageQuery("insureeOfficers",
    null,
    mm.getRef("insuree.InsureeOfficerPicker.projection")
  );
  return graphql(payload, 'INSUREE_INSUREE_OFFICERS');
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

export function fetchRelations(mm) {
  const payload = formatQuery("relations",
    null,
    ["id"]
  );
  return graphql(payload, 'INSUREE_RELATIONS');
}

export function fetchInsureeSummaries(mm, filters) {
  var projections = [
    "id", "uuid", "validityFrom", "validityTo",
    "chfId", "otherNames", "lastName", "phone", "gender{code}", "dob", "marital",
    "family{uuid}",
    "currentVillage" + mm.getProjection("location.Location.FlatProjection"),
    "clientMutationId"]
  const payload = formatPageQueryWithCount("insurees",
    filters,
    projections
  );
  return graphql(payload, 'INSUREE_INSUREES');
}

function formatInsureePhoto(photo) {
  return `{
    ${!!photo.id ? `id: ${decodeId(photo.id)}` : ""}
    ${!!photo.uuid ? `uuid: "${photo.uuid}"` : ""}
    ${!!photo.officerId ? `officerId: ${decodeId(photo.officerId)}` : ""}
    ${!!photo.date ? `date: "${photo.date}"` : ""}
    ${!!photo.photo ? `photo: "${photo.photo}"` : ""}
    ${!!photo.folder ? `folder: "${photo.folder}"` : ""}
    ${!!photo.folder ? `filename: "${photo.filename}"` : ""}
  }`
}

export function formatInsureeGQL(mm, insuree) {
  return `
    ${insuree.uuid !== undefined && insuree.uuid !== null ? `uuid: "${insuree.uuid}"` : ''}
    ${!!insuree.chfId ? `chfId: "${insuree.chfId}"` : ""}
    ${!!insuree.lastName ? `lastName: "${insuree.lastName}"` : ""}
    ${!!insuree.otherNames ? `otherNames: "${insuree.otherNames}"` : ""}
    ${!!insuree.gender && !!insuree.gender.code ? `genderId: "${insuree.gender.code}"` : ""}
    ${!!insuree.dob ? `dob: "${insuree.dob}"` : ''}
    head: ${!!insuree.head}
    ${!!insuree.marital ? `marital: "${insuree.marital}"` : ""}
    ${!!insuree.passport ? `passport: "${insuree.passport}"` : ""}
    ${!!insuree.phone ? `phone: "${insuree.phone}"` : ""}
    ${!!insuree.email ? `email: "${insuree.email}"` : ""}
    ${!!insuree.currentAddress ? `currentAddress: "${insuree.currentAddress}"` : ""}
    ${!!insuree.currentVillage && !!insuree.currentVillage.id ? `currentVillageId: ${decodeId(insuree.currentVillage.id)}` : ""}
    ${!!insuree.photo ? `photo:${formatInsureePhoto(insuree.photo)}` : ""}
    cardIssued:${!!insuree.cardIssued}
    ${!!insuree.profession && !!insuree.profession.id ? `professionId: ${insuree.profession.id}` : ""}
    ${!!insuree.education && !!insuree.education.id ? `educationId: ${insuree.education.id}` : ""}
    ${!!insuree.typeOfId && !!insuree.typeOfId.code ? `typeOfIdId: "${insuree.typeOfId.code}"` : ""}
    ${!!insuree.family && !!insuree.family.id ? `familyId: ${decodeId(insuree.family.id)}` : ""}
    ${!!insuree.relationship && !!insuree.relationship.id ? `relationshipId: ${insuree.relationship.id}` : ""}
    ${!!insuree.healthFacility && !!insuree.healthFacility.id ? `healthFacilityId: ${decodeId(insuree.healthFacility.id)}` : ""}
    ${!!insuree.jsonExt ? `jsonExt: ${formatJsonField(insuree.jsonExt)}` : ""}
  `
}

export function formatFamilyGQL(mm, family) {
  return `  
    ${family.uuid !== undefined && family.uuid !== null ? `uuid: "${family.uuid}"` : ''}
    headInsuree: {
      ${formatInsureeGQL(mm, family.headInsuree)}
      head: true
    }
    ${!!family.location ? `locationId: ${decodeId(family.location.id)}` : ""}
    poverty: ${!!family.poverty}
    ${!!family.familyType && !!family.familyType.code ? `familyTypeId: "${family.familyType.code}"` : ""}
    ${!!family.address ? `address: "${family.address}"` : ""}
    ${!!family.confirmationType && !!family.confirmationType.code ? `confirmationTypeId: "${family.confirmationType.code}"` : ""}
    ${!!family.confirmationNo ? `confirmationNo: "${family.confirmationNo}"` : ""}
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
  let mutation = formatMutation("updateFamily", formatFamilyGQL(mm, family), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['INSUREE_MUTATION_REQ', 'INSUREE_UPDATE_FAMILY_RESP', 'INSUREE_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
      familyUuid: family.uuid,
    }
  )
}

export function deleteFamily(mm, family, deleteMembers, clientMutationLabel) {
  let mutation = formatMutation("deleteFamilies", `uuids: ["${family.uuid}"], deleteMembers: ${deleteMembers}`, clientMutationLabel);
  family.clientMutationId = mutation.clientMutationId;
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['INSUREE_MUTATION_REQ', 'INSUREE_DELETE_FAMILY_RESP', 'INSUREE_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
      familyUuid: family.uuid,
    }
  )
}

export function createInsuree(mm, insuree, clientMutationLabel) {
  let mutation = formatMutation("createInsuree", formatInsureeGQL(mm, insuree), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['INSUREE_MUTATION_REQ', 'INSUREE_CREATE_INSUREE_RESP', 'INSUREE_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function updateInsuree(mm, insuree, clientMutationLabel) {
  let mutation = formatMutation("updateInsuree", formatInsureeGQL(mm, insuree), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['INSUREE_MUTATION_REQ', 'INSUREE_UPDATE_INSUREE_RESP', 'INSUREE_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function removeInsuree(mm, family_uuid, insuree, clientMutationLabel) {
  let mutation = formatMutation("removeInsurees", `uuid: "${family_uuid}", uuids: ["${insuree.uuid}"]`, clientMutationLabel);
  insuree.clientMutationId = mutation.clientMutationId;
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['INSUREE_MUTATION_REQ', 'INSUREE_REMOVE_INSUREES_RESP', 'INSUREE_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
      familyUuid: family_uuid,
    }
  )
}

export function deleteInsuree(mm, family_uuid, insuree, clientMutationLabel) {
  let mutation = formatMutation("deleteInsurees", `${!!family_uuid ? `uuid: "${family_uuid}",` : ""} uuids: ["${insuree.uuid}"]`, clientMutationLabel);
  insuree.clientMutationId = mutation.clientMutationId;
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['INSUREE_MUTATION_REQ', 'INSUREE_DELETE_INSUREES_RESP', 'INSUREE_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
      familyUuid: family_uuid,
    }
  )
}

export function setFamilyHead(mm, family_uuid, insuree_uuid, clientMutationLabel) {
  let mutation = formatMutation("setFamilyHead", `uuid: "${family_uuid}", insureeUuid: "${insuree_uuid}"`, clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['INSUREE_MUTATION_REQ', 'INSUREE_SET_FAMILY_HEAD_RESP', 'INSUREE_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
      familyUuid: family_uuid,
    }
  )
}

export function changeFamily(mm, family_uuid, insuree_uuid, clientMutationLabel) {
  let mutation = formatMutation("changeInsureeFamily", `familyUuid: "${family_uuid}", insureeUuid: "${insuree_uuid}"`, clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['INSUREE_MUTATION_REQ', 'INSUREE_CHANGE_FAMILY_HEAD_RESP', 'INSUREE_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
      familyUuid: family_uuid,
      insureeUuid: insuree_uuid,
    }
  )
}