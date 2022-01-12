import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import ReportsClient from "../../infrastructure/clients/daily-helper/ReportsClient";
import { DefaultPageSize } from "../../utils/Environment";

const client = new ReportsClient();

const DailyArchiveViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const [loaded, setLoaded] = useState(false);
    const { workspace } = useContext(WorkspaceContext);
    const { enqueueSnackbar } = useSnackbar();
    const [days, setDays] = useState<string[]>([]);
    const [page, setPage] = useState<number>(0);
    const [pagesTotal, setPagesTotal] = useState<number>(0);

    const load = useCallback((teamId: number, page: number) => {
        client.getAvailableDays(teamId, { page: page, pageSize: DefaultPageSize })
            .then((result) => {
                setDays(result.data ?? []);
                setPage(result?.metadata?.page ?? 0);
                setPagesTotal(result?.metadata?.totalPages ?? 0);
            })
            .catch(e => enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }))
            .finally(() => setLoaded(true));

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
                workspace,
                days,
                page,
                pagesTotal,
                onPageChange: handlePageChange
            }
        )
    );
}

export default DailyArchiveViewModel;