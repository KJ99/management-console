import ProfileSettings from "./ProfileSettings";

export default class User {
    id?: string;
    username?: string
    firstName?: string;
    lastName?: string;
    pictureUrl?: string;
    pictureId?: number;
    settings?: ProfileSettings;
}