import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import ActionItemsClient from "../../infrastructure/clients/retro-helper/ActionItemsClient";
import ActionItem from "../../models/retrospective/ActionItem";
import { mapper } from "../../utils/Mapper";
import ActionItemUpdateModel from "../../models/retrospective/ActionItemUpdateModel";
import MembersClient from "../../infrastructure/clients/teams-api/MembersClient";
import Member from "../../models/member/Member";

const client = new ActionItemsClient();
const membersClient = new MembersClient();

const ActionItemsViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const [loaded, setLoaded] = useState(false);
    const { workspace } = useContext(WorkspaceContext);
    const { enqueueSnackbar } = useSnackbar();
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [teamMembers, setTeamMembers] = useState<Member[]>([]);

    const load = useCallback((teamId: number) => {
        client.getActionItems({
            teamId: teamId,
            completed: 0
        })
            .then((result) => setActionItems(result))
            .catch(e => enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }))
            .finally(() => setLoaded(true));

    }, [enqueueSnackbar, strings]);

    const loadMembers = useCallback((workspaceId: number) => {
        membersClient.getTeamMembers(workspaceId)
            .then((members) => setTeamMembers(members))
            .catch(() => console.warn('Could not load team members'));
    }, []);

    useEffect(() => {
        if (workspace?.id != null) {
            load(workspace.id);
            loadMembers(workspace.id);
        }
    }, [workspace, load, loadMembers]);

    const handleMarkAsCompleted = useCallback((item: ActionItem) => {
        const model = mapper.map(item, ActionItemUpdateModel, ActionItem);
        model.completed = true;
        client.updateActionItem(item, model)
            .then(() => {
                enqueueSnackbar(strings('/retro/action-item-update-success'), { variant: 'success' });
                load(workspace?.id ?? -1);
            })
            .catch(() => enqueueSnackbar(strings('/retro/action-item-update-fail'), { variant: 'error' }));
    }, [workspace, enqueueSnackbar, strings]);

    return Children.only(
        cloneElement(
            children,
            {
                strings,
                loaded,
                workspace,
                data: actionItems,
                onMarkAsCompleted: handleMarkAsCompleted,
                teamMembers
            }
        )
    );
}

export default ActionItemsViewModel;