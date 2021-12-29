import ApiError from "../../../models/ApiError";

export default class ConflictError extends Error {
    error?: ApiError;

    constructor(error?: ApiError) {
        super();
        this.error = error;
    }

}