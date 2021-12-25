import IdentityServerClient from "./IdentityServerClient";
import ApiConfig from './config';
import User from "../../../models/profile/User";
import Profile from "../../../models/profile/Profile";
import ProfileUpdateModel from "../../../models/profile/ProfileUpdateModel";
import * as PatchUtil from '../../../utils/PatchUtil';
import ChangePasswordModel from "../../../models/profile/ChangePasswordModel";
import MediaType from "../../../extension/MediaType";
import SettingsUpdateModel from "../../../models/profile/SettingsUpdateModel";
import UserSettingsUpdateModel from "../../../models/profile/UserSettingsUpdateModel";

const endpoints = ApiConfig.endpoints.profile;

export default class ProfileClient extends IdentityServerClient {
    constructor() {
        super(endpoints.base);
    }

    async getCurrentUserProfile(): Promise<User> {
        return this._apiClient.get({}, User);
    }

    async getProfile(id: string): Promise<Profile> {
        return this._apiClient.get({ url: endpoints.particular, routeParams: { id } }, Profile);
    }

    async updateProfile(original: User, updated: ProfileUpdateModel) {
        return this._apiClient.patch({
            body: PatchUtil.prepare(original, updated),
            contentType: MediaType.json
        });
    }

    async updateSettings(original: User, updated: SettingsUpdateModel) {
        const model =  new UserSettingsUpdateModel();
        model.settings = updated;

        return this._apiClient.patch({
            body: PatchUtil.prepare(original, model),
            contentType: MediaType.json
        });
    }

    async updatePassword(model: ChangePasswordModel) {
        return this._apiClient.put({
            url: endpoints.password,
            body: model,
            contentType: MediaType.json
        })
    }
}