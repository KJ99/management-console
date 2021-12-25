import TeamsApiClient from "./TeamsApiClient";
import ApiConfig from './config';
import TeamModel from "../../../models/team/TeamModel";
import Team from "../../../models/team/Team";
import Page from "../../../models/page/Page";
import TeamUpdateModel from "../../../models/team/TeamUpdateModel";
import TeamJoinModel from "../../../models/team/TeamJoinModel";
import MediaType from "../../../extension/MediaType";
import PageQuery from "../../../models/page/PageQuery";
import TeamPage from "../../../models/team/TeamPage";
import * as PatchUtil from '../../../utils/PatchUtil';

const endpoints = ApiConfig.endpoints.teams;

export default class TeamsClient extends TeamsApiClient {
    constructor() {
        super(endpoints.base);
    }

    async createTeam(model: TeamModel): Promise<Team> {
        return this._apiClient.post(
            {
                body: model,
                contentType: MediaType.json
            },
            Team
        );
    }

    async getUserTeams(query?: PageQuery): Promise<Page<Team>> {
        return this._apiClient.get({ query }, TeamPage);
    }

    async getTeam(id: number): Promise<Team> {
        return this._apiClient.get(
            {
                url: endpoints.particular,
                routeParams: { id }
            },
            Team
        );
    }

    async updateTeam(original: Team, updated: TeamUpdateModel) {
        return this._apiClient.patch({
            url: endpoints.particular,
            routeParams: { id: original.id },
            body: PatchUtil.prepare(original, updated),
            contentType: MediaType.json
        });
    }

    async joinTeam(model: TeamJoinModel) {
        return this._apiClient.post({
            url: endpoints.join,
            body: model,
            contentType: MediaType.json
        });
    }

    async leaveTeam(id: number) {
        return this._apiClient.delete({ url: endpoints.leave, routeParams: { id } });
    }

    async deleteTeam(id: number) {
        return this._apiClient.delete({ url: endpoints.particular, routeParams: { id } });
    }
}