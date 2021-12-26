import PlanningPokerClient from "./PlanningPokerClient";
import ApiConfig from './config';
import PlanningItemModel from "../../../models/planning/PlanningItemModel";
import PlanningItem from "../../../models/planning/PlanningItem";
import PlanningItemUpdateModel from "../../../models/planning/PlanningItemUpdateModel";
import MediaType from "../../../extension/MediaType";
import PlanningItemsImportModel from "../../../models/planning/PlanningItemsImportModel";
import * as PatchUtil from '../../../utils/PatchUtil';

const endpoints = ApiConfig.endpoints.items;

export default class PlanningItemsClient extends PlanningPokerClient {
    constructor() {
        super(endpoints.base);
    }

    async createItem(model: PlanningItemModel): Promise<PlanningItem> {
        return this._apiClient.post(
            {
                routeParams: { planningId: model.planningId },
                body: model,
                contentType: MediaType.json
            },
            PlanningItem
        );
    }

    async importItems(model: PlanningItemsImportModel) {
        return this._apiClient.post({
            url: endpoints.import,
            routeParams: { planningId: model.planningId },
            body: model,
            isFormData: true
        })
    }

    async updateItem(planningId: number, original: PlanningItem, updated: PlanningItemUpdateModel) {
        return this._apiClient.patch({
            url: endpoints.particular,
            routeParams: { planningId, itemId: original.id },
            body: PatchUtil.prepare(original, updated),
            contentType: MediaType.json
        });
    }

    async getItems(planningId: number): Promise<PlanningItem[]> {
        return this._apiClient.get({ routeParams: { planningId } }, PlanningItem);
    }

    async getItem(planningId: number, itemId: number): Promise<PlanningItem> {
        return this._apiClient.get(
            {
                url: endpoints.particular,
                routeParams: { planningId, itemId }
            },
            PlanningItem
        );
    }

    async deleteItem(planningId: number, itemId: number) {
        return this._apiClient.delete({
            url: endpoints.particular,
            routeParams: { planningId, itemId }
        });
    }
}