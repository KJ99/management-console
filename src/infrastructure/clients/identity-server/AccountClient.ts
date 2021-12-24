import IdentityServerClient from "./IdentityServerClient";
import ApiConfig from './config';
import AccountCreateModel from "../../../models/account/AccountCreateModel";
import VerificationTokenResult from "../../../models/account/VerificationTokenResult";
import ResendVerificationModel from "../../../models/account/ResendVerificationModel";
import VerifyAccountModel from "../../../models/account/VerifyAccountModel";
import CheckAvailabilityModel from "../../../models/account/CheckAvailabilityModel";
import AvailabilityResult from "../../../models/account/AvailabilityResult";

const endpoints = ApiConfig.endpoints.account;

export default class AccountClient extends IdentityServerClient {
    constructor() {
        super(endpoints.base);
    }

    async createAccount(model: AccountCreateModel): Promise<VerificationTokenResult> {
        return this._apiClient.post({
            url: endpoints.base,
            body: model
        });
    }

    async resendVerification(model: ResendVerificationModel): Promise<VerificationTokenResult> {
        return this._apiClient.post({
            url: endpoints.resendVerification,
            body: model
        });
    }

    async verifyAccount(model: VerifyAccountModel) {
        return this._apiClient.put({
            url: endpoints.verify,
            body: model
        })
    }

    async checkAvailability(query: CheckAvailabilityModel): Promise<AvailabilityResult> {
        return this._apiClient.get({
            url: endpoints.availability,
            query: query
        })
    } 
}