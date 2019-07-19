import { RSAA } from "redux-api-middleware";
import { baseApiUrl, apiHeaders } from "@openimis/fe-core";

export function enquiry(chfid) {
    let payload = `
      {
        insuree(chfId:"${chfid}")
        {
          chfId,lastName,photo{folder, filename}
        }
      }
    `
    return {
      [RSAA]: {
        endpoint: `${baseApiUrl}/graphql`,
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({"query": payload}),
        types: [
          'INSUREE_ENQUIRY_REQ',
          'INSUREE_ENQUIRY_RESP',
          'INSUREE_ENQUIRY_ERR'
        ],
      },
    };
  }
  