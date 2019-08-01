import { graphql } from "@openimis/fe-core";

export function fetchInsuree(chfid) {
  let payload = `
      {
        insuree(chfId:"${chfid}")
        {
          chfId, lastName, otherNames, dob, age,
          photo{folder,filename}, 
          gender{code, gender, altLanguage}, 
          healthFacility{id, code, name}
        }
      }
    `
  return graphql(payload, 'INSUREE_ENQUIRY');
}

export function fetchInsureeFamily(chfid) {
  let payload = `
      {
        insureeFamilyMembers(chfId:"${chfid}")
        {
          chfId, otherNames, lastName, head, phone
        }
      }
    `
  return graphql(payload, 'INSUREE_FAMILY');
}