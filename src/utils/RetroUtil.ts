import Member from "../models/member/Member";
import ActionItem from "../models/retrospective/ActionItem";

export const prepareActionItemSubtitle = (
    actionItem: ActionItem, 
    members: Member[], 
    stringResolver: Function
): string => {
    const parts = [];
    if (actionItem.dueDate != null) {
        parts.push(actionItem.dueDate);
    }
    const assignee = members.find((member) => member.userId === actionItem.assigneeId);
    if (assignee != null) {
        parts.push(`${assignee.firstName} ${assignee.lastName}`);
    }
    if (actionItem.completed) {
        parts.push(stringResolver('/retro/item-completed').toUpperCase());
    }

    return parts.join(' | ')

}