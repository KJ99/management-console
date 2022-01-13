import IEvent from "../IEvent";

export default class Planning implements IEvent {
    id?: number;
    title?: string;
    status?: string;
    startDate?: string;
}