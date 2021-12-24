import ProfileSettingsUpdateModel from "./ProfileSettingsUpdateModel";

export default class UserUpdateModel {
    username: string = '';
    firstName: string = '';
    lastName: string = '';
    pictureId?: number;
    settings?: ProfileSettingsUpdateModel;
}