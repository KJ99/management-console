import ApiError from "../models/ApiError";

export const processFormError = (errors: ApiError[]) => {
    const result: any = {};
    errors.forEach((error) => {
        const key = error.path != null && error.path !== 'null' ? error.path : 'submit';
        result[key] = mapApiError(error.code);
    });

    return result;
}

export const mapApiError = (code?: string): string => {
    return code != null && typeof ErrorMap[code] == 'string' 
        ? ErrorMap[code]
        : '/errors/invalid'
}

const ErrorMap: any = {
    'ID.001': '/errors/invalid-email',
    'ID.002': '/errors/provided-value-wrong-length', 
    'ID.003': '/errors/password', 
    'ID.004': '/errors/passwords-not-match', 
    'ID.005': '/errors/username-taken', 
    'ID.006': '/errors/email-taken', 
    'ID.007': '/errors/invalid-verification-pin', 
    'ID.008': '/errors/pin-expired', 
    'ID.009': '/errors/user-verified', 
    'ID.010': '/errors/account-not-verified'
}