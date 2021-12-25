import ApiConfig from './config';
import UploadModel from "../../../models/upload/UploadModel";
import UplaodedFile from "../../../models/upload/UploadedFile";
import MediaType from "../../../extension/MediaType";
import IUploader from "../../IUploader";
import TeamsApiClient from './TeamsApiClient';

const endpoints = ApiConfig.endpoints.resources;

export default class TeamsResourcesClient extends TeamsApiClient implements IUploader {
    constructor() {
        super(endpoints.base);
    }
    
    async upload(model: UploadModel): Promise<UplaodedFile> {
        return this._apiClient.post({
            body: model,
            isFormData: true
        });
    }

    async get(id: number): Promise<UplaodedFile> {
        return this._apiClient.get({
            url: endpoints.particular,
            routeParams: { id }
        })
    }
}