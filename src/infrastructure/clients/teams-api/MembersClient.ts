import TeamsApiClient from "./TeamsApiClient";
import ApiConfig from './config';
import TeamPage from "../../../models/team/TeamPage";
import Page from "../../../models/page/Page";
import Team from "../../../models/team/Team";
import Member from "../../../models/member/Member";
import MemberPage from "../../../models/member/MemberPage";
import MemberUpdateModel from "../../../models/member/MemberUpdateModel";
import * as PatchUtil from '../../../utils/PatchUtil';
import MediaType from "../../../extension/MediaType";

const endpoints = ApiConfig.endpoints.members;

export default class MembersClient extends TeamsApiClient {
    constructor() {
        super(endpoints.base);
    }

    async getTeamMembers(teamId: number): Promise<Member[]> {
        return this._apiClient.get({ routeParams: { teamId: teamId } }, Member)
    }

    async get(teamId: number, userId: string): Promise<Member> {
        return this._apiClient.get(
            {
                url: endpoints.particular,
                routeParams: { teamId, userId }
            },
            Member
        );
    }

    async update(teamId: number, userId: string, original: Member, updated: MemberUpdateModel) {
        return this._apiClient.patch({
            url: endpoints.particular,
            routeParams: { teamId, userId },
            body: PatchUtil.prepare(original, updated),
            contentType: MediaType.json
        });
    }

    async delete(teamId: number, userId: string) {
        return this._apiClient.delete({
            url: endpoints.particular,
            routeParams: { teamId, userId }
        });
    }
}