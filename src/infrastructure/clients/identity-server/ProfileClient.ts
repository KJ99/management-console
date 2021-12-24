import IdentityServerClient from "./IdentityServerClient";
import ApiConfig from './config';
import User from "../../../models/profile/User";
import Profile from "../../../models/profile/Profile";
import UserUpdateModel from "../../../models/update/UserUpdateModel";
import * as PatchUtil from '../../../utils/PatchUtil';
import ChangePasswordModel from "../../../models/profile/ChangePasswordModel";

const endpoints = ApiConfig.endpoints.profile;

export default class ProfileClient extends IdentityServerClient {
    constructor() {
        super(endpoints.base);
    }

    async getCurrentUserProfile(): Promise<User> {
        return this._apiClient.get({ url: endpoints.base }, User);
    }

    async getProfile(id: string): Promise<Profile> {
        return this._apiClient.get({ url: endpoints.particular, routeParams: { id } }, Profile);
    }

    async updateProfile(original: User, updated: UserUpdateModel) {
        return this._apiClient.patch({
            url: endpoints.particular,
            routeParams: { id: original.id },
            body: PatchUtil.prepare(original, updated)
        })
    }

    async updatePassword(model: ChangePasswordModel) {
        return this._apiClient.put({
            url: endpoints.password,
            body: model
        })
    }
}