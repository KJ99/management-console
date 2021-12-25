import TeamsApiClient from "./TeamsApiClient";
import ApiConfig from './config';
import InvitationModel from "../../../models/invitations/InvitationModel";
import InvitationCodeResult from "../../../models/invitations/InvitationCodeResult";
import Invitation from "../../../models/invitations/Invitation";
import MediaType from "../../../extension/MediaType";

const endpoints = ApiConfig.endpoints.invitations;

export default class InvitationsClient extends TeamsApiClient {
    constructor() {
        super(endpoints.base);
    }

    async create(model: InvitationModel): Promise<InvitationCodeResult> {
        return this._apiClient.post({
            body: model,
            contentType: MediaType.json
        })
    }

    async get(code: string): Promise<Invitation> {
        return this._apiClient.get({
            url: endpoints.particular,
            routeParams: { id: code }
        });
    }

    async delete(code: string) {
        return this._apiClient.delete({
            url: endpoints.particular,
            routeParams: { id: code }
        });
    }
}