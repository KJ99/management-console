import RetroHelperClient from "./RetroHelperClient";
import ApiConfig from './config';
import AnswerModel from "../../../models/retrospective/AnswerModel";
import Answer from "../../../models/retrospective/Answer";
import AnswerUpdateModel from "../../../models/retrospective/AnswerUpdateModel";
import AnswerQuery from "../../../models/retrospective/AnswerQuery";
import MediaType from "../../../extension/MediaType";
import * as PatchUtil from '../../../utils/PatchUtil';

const endpoints = ApiConfig.endpoints.answers;

export default class AnswersClient extends RetroHelperClient {
    constructor() {
        super(endpoints.base);
    }

    async createAnswer(model: AnswerModel): Promise<Answer> {
        return this._apiClient.post(
            {
                body: model,
                contentType: MediaType.json
            },
            Answer
        );
    }

    async updateAnswer(original: Answer, updated: AnswerUpdateModel) {
        return this._apiClient.patch({
            url: endpoints.particular,
            routeParams: { id: original.id },
            body: PatchUtil.prepare(original, updated),
            contentType: MediaType.json
        });
    }

    async getAnswers(query: AnswerQuery): Promise<Answer[]> {
        return this._apiClient.get({ query }, Answer);
    }

    async get(id: number): Promise<Answer> {
        return this._apiClient.get({ url: endpoints.particular, routeParams: { id } }, Answer);
    }

    async delete(id: number) {
        return this._apiClient.delete({ url: endpoints.particular, routeParams: { id } });
    }
}  