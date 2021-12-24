import IdentityServerClient from "./IdentityServerClient";
import ApiConfig from './config';
import UploadModel from "../../../models/upload/UploadModel";
import UplaodedFile from "../../../models/upload/UploadedFile";

const endpoints = ApiConfig.endpoints.resources;

export default class ResourcesClient extends IdentityServerClient {
    constructor() {
        super(endpoints.base);
    }
    
    async upload(model: UploadModel): Promise<UplaodedFile> {
        return this._apiClient.post({
            url: endpoints.base,
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