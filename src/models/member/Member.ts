import MemberRole from "./MemberRole";

export default class Member {
    id?: number;
    userId?: string;
    firstName?: string;
    lastName?: string;
    pictureUrl?: string;
    roles?: MemberRole[];
}