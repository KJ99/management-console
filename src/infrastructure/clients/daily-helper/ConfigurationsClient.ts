import DailyHelperClient from "./DailyHelperClient";
import ApiConfig from './config';
import DailyConfigModel from "../../../models/daily/DailyConfigModel";
import DailyConfig from "../../../models/daily/DailyConfig";
import MediaType from "../../../extension/MediaType";
import * as PatchUtil from '../../../utils/PatchUtil';

const endpoints = ApiConfig.endpoints.configurations;

export default class ConfigurationsClient extends DailyHelperClient {
    constructor() {
        super(endpoints.base);
    }

    async createConfiguration(model: DailyConfigModel): Promise<DailyConfig> {
        return this._apiClient.post(
            {
                body: model,
                contentType: MediaType.json
            },
            DailyConfig
        );
    }

    async updateConfiguration(teamId: number, original: DailyConfig, updated: DailyConfigModel) {
        return this._apiClient.patch({
            url: endpoints.particular,
            routeParams: { teamId },
            body: PatchUtil.prepare(original, updated),
            contentType: MediaType.json
        });
    }

    async get(teamId: number): Promise<DailyConfig> {
        return this._apiClient.get(
            {
                url: endpoints.particular,
                routeParams: { teamId }
            },
            DailyConfig
        );
    }

    async clear(teamId: number): Promise<DailyConfig> {
        return this._apiClient.delete({ url: endpoints.particular, routeParams: { teamId } });
    }
}