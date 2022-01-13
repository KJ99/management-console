import IEvent from "../IEvent";
import RetroConfig from "./RetroConfig";

export default class Retrospective implements IEvent {
    id?: number;
    title?: string;
    startDate?: string;
    status?: string;
    configuration?: RetroConfig;
}