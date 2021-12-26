import Client from "../Client";
import ApiConfig from './config';

export default abstract class TeamsApiClient extends Client {
    constructor(baseUrl?: string) {
        super(ApiConfig.host, baseUrl)
    }
}