import ApiClient from "../api/ApiClient";

export default abstract class Client {
    protected _apiClient: ApiClient;

    constructor(host: string, baseUrl?: string) {
        this._apiClient = new ApiClient({ host: host, baseUrl: baseUrl });
    }
}