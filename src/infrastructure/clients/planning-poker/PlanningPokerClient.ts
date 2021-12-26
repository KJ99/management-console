import Client from "../Client";
import ApiConfig from './config';

export default abstract class PlanningPokerClient extends Client {
    constructor(baseUrl?: string) {
        super(ApiConfig.host, baseUrl)
    }
}