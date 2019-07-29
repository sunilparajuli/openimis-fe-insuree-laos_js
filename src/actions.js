import { graphql } from "@openimis/fe-core";

export function fetchInsuree(chfid) {
  let payload = `
      {
        insuree(chfId:"${chfid}")
        {
          chfId, photo{folder,filename}, lastName, otherNames, dob, gender{code, gender, altLanguage}, age
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