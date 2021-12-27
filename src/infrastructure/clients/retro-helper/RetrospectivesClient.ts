import RetroHelperClient from "./RetroHelperClient";
import ApiConfig from './config';
import RetrospectiveModel from "../../../models/retrospective/RetrospectiveModel";
import Retrospective from "../../../models/retrospective/Retrospective";
import RetrospectiveUpdateModel from "../../../models/retrospective/RetrospectiveUpdateModel";
import RetroQuery from "../../../models/retrospective/RetroQuery";
import Page from "../../../models/page/Page";
import EventToken from "../../../models/event/EventToken";
import IncomingEvent from "../../../models/event/IncomingEvent";
import MediaType from "../../../extension/MediaType";
import * as PatchUtil from '../../../utils/PatchUtil';
import RetroConfigUpdateModel from "../../../models/retrospective/RetroConfigUpdateModel";
import RetrospectivesPage from "../../../models/retrospective/RetrospectivesPage";
import IncomingRetro from "../../../models/retrospective/IncomingRetro";

const endpoints = ApiConfig.endpoints.retrospectives;

export default class RetrospectivesClient extends RetroHelperClient {
    constructor() {
        super(endpoints.base);
    }
    
    async createRetro(model: RetrospectiveModel): Promise<Retrospective> {
        return this._apiClient.post(
            {
                body: model,
                contentType: MediaType.json
            },
            Retrospective
        );
    }

    async updateRetro(original: Retrospective, updated: RetrospectiveUpdateModel) {
        return this._apiClient.patch({
            url: endpoints.particular,
            routeParams: { id: original.id },
            body: PatchUtil.prepare(original, updated),
            contentType: MediaType.json
        });
    }

    async startRetro(id: number) {
        return this._apiClient.put({
            url: endpoints.start,
            routeParams: { id }
        });
    }

    async nextStep(id: number) {
        return this._apiClient.put({
            url: endpoints.nextStep,
            routeParams: { id }
        });
    }

    async getRetros(query: RetroQuery): Promise<Page<Retrospective>> {
        return this._apiClient.get({ query }, RetrospectivesPage);
    }

    async get(id: number): Promise<Retrospective> {
        return this._apiClient.get(
            {
                url: endpoints.particular,
                routeParams: { id }
            },
            Retrospective
        );
    }

    async getToken(id: number): Promise<EventToken> {
        return this._apiClient.get(
            {
                url: endpoints.token,
                routeParams: { id }
            },
            EventToken
        );
    }

    async getReport(id: number): Promise<Blob> {
        return this._apiClient.get({
            url: endpoints.report,
            routeParams: { id },
            accept: MediaType.json
        });
    }

    async getIncoming(query: RetroQuery): Promise<IncomingEvent<Retrospective>> {
        return this._apiClient.get({ url: endpoints.incoming, query }, IncomingRetro);
    }

    async deleteRetro(id: number) {
        return this._apiClient.delete({ url: endpoints.particular, routeParams: { id } });
    }
}  