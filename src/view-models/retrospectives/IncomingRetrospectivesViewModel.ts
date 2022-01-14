import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import ReportsClient from "../../infrastructure/clients/daily-helper/ReportsClient";
import { DefaultPageSize } from "../../utils/Environment";
import RetrospectivesClient from "../../infrastructure/clients/retro-helper/RetrospectivesClient";
import Retrospective from "../../models/retrospective/Retrospective";
import IncomingRetro from "../../models/retrospective/IncomingRetro";
import RetroStatus from "../../extension/RetroStatus";

const client = new RetrospectivesClient();

const IncomingRetrospectivesViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const [loaded, setLoaded] = useState(false);
    const { workspace } = useContext(WorkspaceContext);
    const { enqueueSnackbar } = useSnackbar();
    const [retrospectives, setRetrospectives] = useState<Retrospective[]>([]);
    const [incoming, setIncoming] = useState<IncomingRetro|undefined>();
    const [page, setPage] = useState<number>(0);
    const [pagesTotal, setPagesTotal] = useState<number>(0);

    const load = useCallback((teamId: number, page: number) => {
        client.getIncoming({ teamId })
            .then((retro) => setIncoming(retro))
            .catch(() => enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }))
            .finally(() => setLoaded(true));

        client.getRetros({
            page, 
            pageSize: DefaultPageSize,
            teamId,
            status: RetroStatus[RetroStatus.SCHEDULED]
        })
            .then((result) => {
                setRetrospectives(result.data ?? []);
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

    return Children.only(
        cloneElement(
            children,
            {
                strings,
                loaded,
                scheduled: retrospectives,
                incoming,
                workspace,
                page,
                pagesTotal,
                onPageChange: handlePageChange
            }
        )
    );
}

export default IncomingRetrospectivesViewModel;