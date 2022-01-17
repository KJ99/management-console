import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import ReportsClient from "../../infrastructure/clients/daily-helper/ReportsClient";
import { DefaultPageSize } from "../../utils/Environment";
import Planning from "../../models/planning/Planning";
import PlanningsClient from "../../infrastructure/clients/planning-poker/PlanningsClient";
import PlanningStatus from "../../extension/PlanningStatus";
import IncomingPlanning from "../../models/planning/IncomingPlanning";
import { useNavigate } from "react-router";
import { preparePath } from "../../utils/PathUtil";
import paths from '../../routings/paths.json';

const client = new PlanningsClient();

const IncomingPlanningsViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const [loaded, setLoaded] = useState(false);
    const { workspace } = useContext(WorkspaceContext);
    const { enqueueSnackbar } = useSnackbar();
    const [plannings, setPlannings] = useState<Planning[]>([]);
    const [incoming, setIncoming] = useState<IncomingPlanning|undefined>();
    const [page, setPage] = useState<number>(0);
    const [pagesTotal, setPagesTotal] = useState<number>(0);
    const navigate = useNavigate();

    const load = useCallback((teamId: number, page: number) => {
        client.getIncomingPlanning({ teamId })
            .then((planning) => setIncoming(planning))
            .catch(() => enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }))
            .finally(() => setLoaded(true));

        client.getPlannings({
            page, 
            pageSize: DefaultPageSize,
            teamId,
            status: PlanningStatus[PlanningStatus.SCHEDULED]
        })
            .then((result) => {
                setPlannings(result.data ?? []);
                setPage(result?.metadata?.page ?? 0);
                setPagesTotal(result?.metadata?.totalPages ?? 0);
            })
            .catch((e) => enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }));

    }, [enqueueSnackbar, strings]);

    useEffect(() => {
        if (workspace != null) {
            load(workspace.id ?? -1, 0);
        }
    }, [workspace, load]);

    const handlePageChange = useCallback((page) => {
        load(workspace?.id ?? -1, page);
    }, [load]);

    const handleStart = useCallback(
        async () => {
            if (incoming?.data?.id != null && workspace != null) {
                try {
                    if (incoming.data.status === PlanningStatus[PlanningStatus.SCHEDULED]) {
                        await client.startPlanning(incoming.data.id);
                    }
                    const token = await client.getPlanningToken(incoming.data.id);
                    navigate(paths.app.meetups.planning, {
                        state: {
                            workspaceId: workspace.id,
                            planningId: incoming.data.id,
                            token: token.accessToken
                        }
                    });
                } catch (e) {
                    console.warn(e);
                    enqueueSnackbar(strings('/plannings/live/start-fail'), { variant: 'error' });
                }
            }
        }, 
        [enqueueSnackbar, strings, incoming, workspace]
    );

    return Children.only(
        cloneElement(
            children,
            {
                strings,
                loaded,
                scheduled: plannings,
                incoming,
                workspace,
                page,
                pagesTotal,
                onPageChange: handlePageChange,
                onEventStart: handleStart
            }
        )
    );
}

export default IncomingPlanningsViewModel;