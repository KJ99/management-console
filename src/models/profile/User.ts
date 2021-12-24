import ProfileSettings from "./ProfileSettings";

export default class User {
    id?: string;
    firstName?: string;
    lastName?: string;
    pictureUrl?: string;
    settings?: ProfileSettings;
}