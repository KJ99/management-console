import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import ActionItemsClient from "../../infrastructure/clients/retro-helper/ActionItemsClient";
import ActionItem from "../../models/retrospective/ActionItem";
import { mapper } from "../../utils/Mapper";
import ActionItemUpdateModel from "../../models/retrospective/ActionItemUpdateModel";

const client = new ActionItemsClient();


const ActionItemsViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const [loaded, setLoaded] = useState(false);
    const { workspace } = useContext(WorkspaceContext);
    const { enqueueSnackbar } = useSnackbar();
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);

    const load = useCallback((teamId: number) => {
        client.getActionItems({
            teamId: teamId,
            completed: 0
        })
            .then((result) => setActionItems(result))
            .catch(e => enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }))
            .finally(() => setLoaded(true));

    }, [enqueueSnackbar, strings]);

    useEffect(() => {
        if (workspace != null) {
            load(workspace.id ?? -1);
        }
    }, [workspace, load]);

    const handleMarkAsCompleted = useCallback((item: ActionItem) => {
        const model = mapper.map(item, ActionItemUpdateModel, ActionItem);
        model.completed = true;
        client.updateActionItem(item, model)
            .then(() => {
                enqueueSnackbar(strings('/retro/action-item-update-success'), { variant: 'success' });
                load(workspace?.id ?? -1);
            })
            .catch(() => enqueueSnackbar(strings('/retro/action-item-update-fail'), { variant: 'error' }));
    }, []);

    return Children.only(
        cloneElement(
            children,
            {
                strings,
                loaded,
                workspace,
                data: actionItems,
                onMarkAsCompleted: handleMarkAsCompleted
            }
        )
    );
}

export default ActionItemsViewModel;