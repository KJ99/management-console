import DailyHelperClient from "./DailyHelperClient";
import ApiConfig from './config';
import DailyReport from "../../../models/daily/DailyReport";
import Page from "../../../models/page/Page";
import DaysPage from "../../../models/daily/DaysPage";
import PageQuery from "../../../models/page/PageQuery";
import MemberReport from "../../../models/daily/MemberReport";

const endpoints = ApiConfig.endpoints.reports;

export default class ReportsClient extends DailyHelperClient {
    constructor() {
        super(endpoints.base);
    }

    async getForDay(teamId: number, day: string): Promise<MemberReport[]> {
        return this._apiClient.get(
            {
                url: endpoints.particularDay,
                routeParams: { teamId, day }
            },
            MemberReport
        );
    }

    async getAvailableDays(teamId: number, query?: PageQuery): Promise<Page<string>> {
        return this._apiClient.get(
            {
                url: endpoints.days,
                routeParams: { teamId },
                query
            },
            DaysPage
        );

    }
}