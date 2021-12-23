import ApiError from "../models/ApiError";

export default class BadRequestError extends Error {
    errors: ApiError[];
    
    constructor(errors: ApiError|ApiError[]) {
        super();
        this.errors = Array.isArray(errors) ? errors : [errors];
    }
}