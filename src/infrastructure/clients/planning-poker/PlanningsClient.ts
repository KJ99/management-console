import PlanningPokerClient from "./PlanningPokerClient";
import ApiConfig from './config';
import PlanningModel from "../../../models/planning/PlanningModel";
import Planning from "../../../models/planning/Planning";
import PlanningUpdateModel from "../../../models/planning/PlanningUpdateModel";
import PageQuery from "../../../models/page/PageQuery";
import PlanningQuery from "../../../models/planning/PlanningQuery";
import Page from "../../../models/page/Page";
import EventToken from "../../../models/event/EventToken";
import IncomingEvent from "../../../models/event/IncomingEvent";
import MediaType from "../../../extension/MediaType";
import PlanningsPage from "../../../models/planning/PlanningsPage";
import IncomingPlanning from "../../../models/planning/IncomingPlanning";
import * as PatchUtil from '../../../utils/PatchUtil';

const endpoints = ApiConfig.endpoints.plannings;

export default class PlanningsClient extends PlanningPokerClient {
    constructor() {
        super(endpoints.base);
    }
    
    async createPlanning(model: PlanningModel): Promise<Planning> {
        return this._apiClient.post(
            {
                body: model,
                contentType: MediaType.json
            },
            Planning
        );
    }

    async getPlannings(query?: PlanningQuery): Promise<Page<Planning>> {
        return this._apiClient.get({ query }, PlanningsPage);
    }

    async getPlanning(id: number): Promise<Planning> {
        return this._apiClient.get(
            {
                url: endpoints.particular,
                routeParams: { id }
            },
            Planning
        );
    }

    async getPlanningToken(id: number): Promise<EventToken> {
        return this._apiClient.get(
            {
                url: endpoints.token,
                routeParams: { id }
            },
            EventToken
        );
    }

    async getPlanningReport(id: number): Promise<Blob> {
        return this._apiClient.get(
            {
                url: endpoints.report,
                routeParams: { id },
                accept: MediaType.pdf
            }
        );
    }

    async getIncomingPlanning(query?: PlanningQuery): Promise<IncomingEvent<Planning>> {
        return this._apiClient.get({ url: endpoints.incoming, query }, IncomingPlanning);
    }

    async updatePlanning(original: Planning, model: PlanningUpdateModel) {
        return this._apiClient.patch({
            url: endpoints.particular,
            routeParams: { id: original.id },
            contentType: MediaType.json,
            body: PatchUtil.prepare(original, model)
        });
    }

    async startPlanning(id: number) {
        return this._apiClient.put({ url: endpoints.start, routeParams: { id } });
    }

    async deletePlanning(id: number) {
        return this._apiClient.delete({ url: endpoints.particular, routeParams: { id } });
    }
}