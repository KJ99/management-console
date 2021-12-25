import IdentityServerClient from "./IdentityServerClient";
import ApiConfig from './config';
import UploadModel from "../../../models/upload/UploadModel";
import UplaodedFile from "../../../models/upload/UploadedFile";
import MediaType from "../../../extension/MediaType";
import IUploader from "../../IUploader";

const endpoints = ApiConfig.endpoints.resources;

export default class IdentityResourcesClient extends IdentityServerClient implements IUploader {
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