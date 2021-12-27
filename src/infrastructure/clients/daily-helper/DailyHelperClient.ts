import Client from "../Client";
import ApiConfig from './config';

export default abstract class DailyHelperClient extends Client {
    constructor(baseUrl?: string) {
        super(ApiConfig.host, baseUrl)
    }
}