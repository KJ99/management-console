import IdentityServerClient from "./IdentityServerClient";
import ApiConfig from './config';
import AuthResult from "../../../models/auth/AuthResult";
import LoginModel from "../../../models/auth/LoginModel";
import PasswordResetInitModel from "../../../models/password-reset/PasswordResetInitModel";
import PasswordResetTokenResult from "../../../models/password-reset/PasswordResetTokenResult";
import PasswordResetModel from "../../../models/password-reset/PasswordResetModel";

const endpoints = ApiConfig.endpoints.auth;

export default class AuthClient extends IdentityServerClient {
    constructor() {
        super(endpoints.base);
    }

    async login(model: LoginModel): Promise<AuthResult> {
        return this._apiClient.post(
            {
                url: endpoints.login,
                body: model
            }, 
            AuthResult
        );
    }

    async initPasswordReset(model: PasswordResetInitModel): Promise<PasswordResetTokenResult> {
        return this._apiClient.post(
            {
                url: endpoints.initPasswordReset,
                body: model
            }, 
            PasswordResetTokenResult
        );
    }

    async resetPassword(model: PasswordResetModel) {
        return this._apiClient.post({
            url: endpoints.passwordReset,
            body: model
        })
    }
}