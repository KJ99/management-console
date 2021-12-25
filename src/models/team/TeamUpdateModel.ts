import TeamSettingsUpdateModel from "./TeamSettingsUpdateModel";

export default class TeamUpdateModel {
    name: string = '';
    pictureId?: number;
    settings?: TeamSettingsUpdateModel
}