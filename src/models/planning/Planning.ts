import IEvent from "../IEvent";
import PlanningStatus from "../../extension/PlanningStatus";

export default class Planning implements IEvent {
    id?: number;
    title?: string;
    status?: string;
    startDate?: string;

    hasStatus(requiredStatus: PlanningStatus): boolean {
        return PlanningStatus[requiredStatus] === this.status;
    }
}