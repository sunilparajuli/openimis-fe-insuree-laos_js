import { parseData, formatServerError, formatGraphQLError } from '@openimis/fe-core';

function reducer(
    state = {
        fetching: false,
        fetched: false,
        error: null,
        insuree: null,
        fetchingFamilyMembers: false,
        fetchedFamilyMembers: false,
        errorFamilyMembers: null,
        familyMembers: null,
    },
    action,
) {
    switch (action.type) {
        case 'INSUREE_ENQUIRY_REQ':
            return {
                ...state,
                fetching: true,
                fetched: false,
                insuree: null,
                error: null,
            };
        case 'INSUREE_ENQUIRY_RESP':
            return {
                ...state,
                fetching: false,
                fetched: true,
                insuree: action.payload.data.insuree,
                error: formatGraphQLError(action.payload)
            };
        case 'INSUREE_ENQUIRY_ERR':
            return {
                ...state,
                fetching: false,
                error: formatServerError(action.payload)
            };
        case 'INSUREE_FAMILY_REQ':
            return {
                ...state,
                fetchingFamilyMembers: true,
                fetchedFamilyMembers: false,
                familyMembers: null,
                errorFamilyMembers: null,
            };
        case 'INSUREE_FAMILY_RESP':
            return {
                ...state,
                fetchingFamilyMembers: false,
                fetchedFamilyMembers: true,
                familyMembers: parseData(action.payload.data.insureeFamilyMembers),
                errorFamilyMembers: formatGraphQLError(action.payload)
            };
        case 'INSUREE_FAMILY_ERR':
            return {
                ...state,
                fetchingFamilyMembers: false,
                errorFamilyMembers: formatServerError(action.payload)
            };
        default:
            return state;
    }
}

export default reducer;
