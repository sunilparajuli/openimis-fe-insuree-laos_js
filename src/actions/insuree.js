import { RSAA } from "redux-api-middleware";
import { baseApiUrl, apiHeaders } from "@openimis/fe-core";

export function enquiry(chfid) {
  let payload = `
      {
        insuree(chfId:"${chfid}")
        {
          chfId, photo{folder,filename}, lastName, otherNames, dob, gender{code, gender, altLanguage}, age
        }
      }
    `
  return {
    [RSAA]: {
      endpoint: `${baseApiUrl}/graphql`,
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({ "query": payload }),
      types: [
        'INSUREE_ENQUIRY_REQ',
        'INSUREE_ENQUIRY_RESP',
        'INSUREE_ENQUIRY_ERR'
      ],
    },
  };
}

export function insureeFamily(chfid) {
  let payload = `
      {
        insureeFamilyMembers(chfId:"${chfid}")
        {
          chfId, otherNames, lastName, head, phone
        }
      }
    `
  return {
    [RSAA]: {
      endpoint: `${baseApiUrl}/graphql`,
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({ "query": payload }),
      types: [
        'INSUREE_FAMILY_REQ',
        'INSUREE_FAMILY_RESP',
        'INSUREE_FAMILY_ERR'
      ],
    },
  };
}