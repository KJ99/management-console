import WorkspaceRole from "../../extension/WorkspaceRole";
import MemberRole from "./MemberRole";

export default class Member {
    id?: number;
    userId?: string;
    firstName?: string;
    lastName?: string;
    pictureUrl?: string;
    roles?: MemberRole[];
    
    hasRole(role: WorkspaceRole): boolean {
        return this.roles?.find((item) => item.code == WorkspaceRole[role]) != null
    }
}