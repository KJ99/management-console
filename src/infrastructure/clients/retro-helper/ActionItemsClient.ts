import RetroHelperClient from "./RetroHelperClient";
import ApiConfig from './config';
import ActionItemModel from "../../../models/retrospective/ActionItemModel";
import ActionItem from "../../../models/retrospective/ActionItem";
import ActionItemUpdateModel from "../../../models/retrospective/ActionItemUpdateModel";
import ActionItemQuery from "../../../models/retrospective/ActionItemQuery";
import MediaType from "../../../extension/MediaType";
import * as PatchUtil from '../../../utils/PatchUtil';

const endpoints = ApiConfig.endpoints.actionItems;

export default class ActionItemsClient extends RetroHelperClient {
    constructor() {
        super(endpoints.base);
    }

    async createActionItem(model: ActionItemModel): Promise<ActionItem> {
        return this._apiClient.post(
            {
                body: model,
                contentType: MediaType.json
            },
            ActionItem
        );
    }

    async updateActionItem(original: ActionItem, updated: ActionItemUpdateModel) {
        return this._apiClient.patch({
            url: endpoints.particular,
            routeParams: { id: original.id },
            body: PatchUtil.prepare(original, updated),
            contentType: MediaType.json
        });
    }

    async getActionItems(query: ActionItemQuery): Promise<ActionItem[]> {
        return this._apiClient.get({ query }, ActionItem);
    }

    async get(id: number): Promise<ActionItem> {
        return this._apiClient.get({ url: endpoints.particular, routeParams: { id } }, ActionItem);
    }

    async delete(id: number): Promise<ActionItem> {
        return this._apiClient.delete({ url: endpoints.particular, routeParams: { id } });
    }
}