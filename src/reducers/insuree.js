import { formatServerError, formatGraphQLError } from '@openimis/fe-core';

function enquiry(
    state = {
        fetching: false,
        error: null,
        insuree: null,
        fetchingFamily: false,
        errorFamily: null,
        insureeFamilyMembers: null,        
    },
    action,
) {
    switch (action.type) {
        case 'INSUREE_ENQUIRY_REQ':
            return {
                ...state,
                fetching: true,
                insuree: null,
                error: null,
            };
        case 'INSUREE_ENQUIRY_RESP':
            return {
                ...state,
                fetching: false,
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
                fetchingFamily: true,
                insureeFamilyMembers: null,
                errorFamily: null,
            };
        case 'INSUREE_FAMILY_RESP':
            return {
                ...state,
                fetchingFamily: false,
                insureeFamilyMembers: action.payload.data.insureeFamilyMembers,
                errorFamily: formatGraphQLError(action.payload)
            };
        case 'INSUREE_FAMILY_ERR':
            return {
                ...state,
                fetchingFamily: false,
                errorFamily: formatServerError(action.payload)
            };
        default:
            return state;
    }
}

export default enquiry;
