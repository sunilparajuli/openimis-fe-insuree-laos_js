import { parseData, pageInfo, formatServerError, formatGraphQLError } from '@openimis/fe-core';

function reducer(
    state = {
        fetching: false,
        fetched: false,
        error: null,
        insuree: null,
        fetchingInsureeFamilyMembers: false,
        fetchedInsureeFamilyMembers: false,
        errorInsureeFamilyMembers: null,
        insureeFamilyMembers: null,
        fetchingFamilyMembers: false,
        fetchedFamilyMembers: false,
        errorFamilyMembers: null,
        familyMembers: null,        
        fetchingInsurees: false,
        fetchedInsurees: false,
        errorInsurees: null,
        insurees: [],
        insureesPageInfo: { totalCount: 0 },
        fetchingConfirmationTypes: false,
        fetchedConfirmationTypes: false,
        errorConfirmationTypes: null,
        confirmationTypes: [],
        fetchingFamilies: false,
        fetchedFamilies: false,
        errorFamilies: null,
        families: [],
        familiesPageInfo: { totalCount: 0 },
        family: {},
        fetchingFamily: false,
        errorFamily: null,
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
                fetchingInsureeFamilyMembers: true,
                fetchedInsureeFamilyMembers: false,
                insureeFamilyMembers: null,
                errorInsureeFamilyMembers: null,
            };
        case 'INSUREE_FAMILY_RESP':
            return {
                ...state,
                fetchingInsureeFamilyMembers: false,
                fetchedInsureeFamilyMembers: true,
                insureeFamilyMembers: action.payload.data.insureeFamilyMembers,
                errorInsureeFamilyMembers: formatGraphQLError(action.payload)
            };
        case 'INSUREE_FAMILY_ERR':
            return {
                ...state,
                fetchingInsureeFamilyMembers: false,
                errorInsureeFamilyMembers: formatServerError(action.payload)
            };
        case 'INSUREE_FAMILY_MEMBERS_REQ':
            return {
                ...state,
                fetchingFamilyMembers: true,
                fetchedFamilyMembers: false,
                insureeFamilyMembers: null,
                errorFamilyMembers: null,
            };
        case 'INSUREE_FAMILY_MEMBERS_RESP':
            return {
                ...state,
                fetchingFamilyMembers: false,
                fetchedFamilyMembers: true,
                familyMembers: action.payload.data.familyMembers,
                errorFamilyMembers: formatGraphQLError(action.payload)
            };
        case 'INSUREE_FAMILY_MEMBERS_ERR':
            return {
                ...state,
                fetchingFamilyMembers: false,
                errorFamilyMembers: formatServerError(action.payload)
            };
        case 'INSUREE_GENDERS_REQ':
            return {
                ...state,
                fetchingInsureeGenders: true,
                fetchedInsureeGenders: false,
                insureeGenders: null,
                errorInsureeGenders: null,
            };
        case 'INSUREE_GENDERS_RESP':
            return {
                ...state,
                fetchingInsureeGenders: false,
                fetchedInsureeGenders: true,
                insureeGenders: action.payload.data.insureeGenders,
                errorInsureeGenders: formatGraphQLError(action.payload)
            };
        case 'INSUREE_GENDERS_ERR':
            return {
                ...state,
                fetchingInsureeGenders: false,
                errorInsureeGenders: formatServerError(action.payload)
            };
        case 'INSUREE_INSUREES_REQ':
            return {
                ...state,
                fetchingInsurees: true,
                fetchedInsurees: false,
                insurees: [],
                errorInsurees: null,
            };
        case 'INSUREE_INSUREES_RESP':
            return {
                ...state,
                fetchingInsurees: false,
                fetchedInsurees: true,
                insurees: parseData(action.payload.data.insurees),
                insureesPageInfo: pageInfo(action.payload.data.insurees),
                errorInsurees: formatGraphQLError(action.payload)
            };
        case 'INSUREE_INSUREES_ERR':
            return {
                ...state,
                fetching: false,
                error: formatServerError(action.payload)
            };
        case 'INSUREE_FAMILY_SEARCHER_REQ':
            return {
                ...state,
                fetchingFamilies: true,
                fetchedFamilies: false,
                families: null,
                familiesPageInfo: { totalCount: 0 },
                errorFamilies: null,
            };
        case 'INSUREE_FAMILY_SEARCHER_RESP':
            return {
                ...state,
                fetchingFamilies: false,
                fetchedFamilies: true,
                families: parseData(action.payload.data.families),
                familiesPageInfo: pageInfo(action.payload.data.families),
                errorFamilies: formatGraphQLError(action.payload)
            };
        case 'INSUREE_FAMILY_SEARCHER_ERR':
            return {
                ...state,
                fetchingFamilies: false,
                errorFamilies: formatServerError(action.payload)
            };
        case 'INSUREE_CONFIRMATION_TYPES_REQ':
            return {
                ...state,
                fetchingConfirmationTypes: true,
                fetchedConfirmationTypes: false,
                confirmationTypes: null,
                errorConfirmationTypes: null,
            };
        case 'INSUREE_CONFIRMATION_TYPES_RESP':
            return {
                ...state,
                fetchingConfirmationTypes: false,
                fetchedConfirmationTypes: true,
                confirmationTypes: action.payload.data.confirmationTypes,
                errorConfirmationTypes: formatGraphQLError(action.payload)
            };
        case 'INSUREE_CONFIRMATION_TYPES_ERR':
            return {
                ...state,
                fetchingConfirmationTypes: false,
                errorConfirmationTypes: formatServerError(action.payload)
            };
        case 'INSUREE_FAMILY_TYPES_REQ':
            return {
                ...state,
                fetchingFamilyTypes: true,
                fetchedFamilyTypes: false,
                familyTypes: null,
                errorFamilyTypes: null,
            };
        case 'INSUREE_FAMILY_TYPES_RESP':
            return {
                ...state,
                fetchingFamilyTypes: false,
                fetchedFamilyTypes: true,
                familyTypes: action.payload.data.familyTypes,
                errorFamilyTypes: formatGraphQLError(action.payload)
            };
        case 'INSUREE_FAMILY_TYPES_ERR':
            return {
                ...state,
                fetchingFamilyTypes: false,
                errorFamilyTypes: formatServerError(action.payload)
            };
        case 'INSUREE_FAMILY_OVERVIEW_REQ':
            return {
                ...state,
                fetchingFamily: true,
                fetchedFamily: false,
                family: null,
                errorFamily: null,
            };
        case 'INSUREE_FAMILY_OVERVIEW_RESP':
            var families = parseData(action.payload.data.families);
            return {
                ...state,
                fetchingFamily: false,
                fetchedFamily: true,
                family: (!!families && families.length > 0) ? families[0] : null,
                errorInsureeFamilyMembers: formatGraphQLError(action.payload)
            };
        case 'INSUREE_FAMILY_OVERVIEW_ERR':
            return {
                ...state,
                fetchingFamily: false,
                errorFamily: formatServerError(action.payload)
            };
        default:
            return state;
    }
}

export default reducer;
