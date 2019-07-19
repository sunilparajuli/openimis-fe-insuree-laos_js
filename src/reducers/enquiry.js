function enquiry(
    state = {
        fetching: false,
        error: null,
        errorMessage: null,
        errorDetail: null,
        insuree: null,
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
                errorMessage: null,
                errorDetail: null,
            };
        case 'INSUREE_ENQUIRY_RESP':
            return {
                ...state,
                fetching: false,
                insuree: action.payload.data.insuree,
                error: !!action.payload.errors ? "Query error" : null,
                errorMessage: null,
                errorDetail: !!action.payload.errors ?
                    action.payload.errors.map((e)=>e.message).join('; ')
                    : null,
            };
        case 'INSUREE_ENQUIRY_ERR':
            return {
                ...state,
                fetching: false,
                error: action.payload.status,
                errorMessage: action.payload.statusText,
                errorDetail: !!action.payload.response && action.payload.response.errors ?
                    action.payload.response.errors.map((e)=>e.message).join('; ')
                    : null,
            };
        default:
            return state;
    }
}

export default enquiry;
