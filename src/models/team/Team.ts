import Role from "../../extension/Role";
import TeamSettings from "./TeamSettings";

export default class Team {
    id?: number;
    name?: string;
    pictureUrl?: string;
    pictureId?: number;
    settings?: TeamSettings;
    roles?: string[]
}