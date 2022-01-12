import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import DailyReport from "../../models/daily/DailyReport";
import ReportsClient from "../../infrastructure/clients/daily-helper/ReportsClient";
import { useParams } from "react-router";
import MemberReport from "../../models/daily/MemberReport";
import MembersClient from "../../infrastructure/clients/teams-api/MembersClient";
import Member from "../../models/member/Member";

const client = new ReportsClient();
const membersClient = new MembersClient();

const DailyReportsViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const [loaded, setLoaded] = useState(false);
    const { day } = useParams();
    const { workspace } = useContext(WorkspaceContext);
    const { enqueueSnackbar } = useSnackbar();
    const [reports, setReports] = useState<MemberReport[]>([]);
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        const teamId = workspace?.id ?? -1;
        if (teamId >= 0) {
            client.getForDay(teamId, day ?? '0000-00-00')
                .then((reports) => setReports(reports))
                .catch(() => 
                    enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' })
                )
                .finally(() => setLoaded(true));

            membersClient.getTeamMembers(teamId)
                .then((members) => setMembers(members))
                .catch(() => 
                    enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' })
                );
                
        }
    }, [workspace, day]);

    return Children.only(
        cloneElement(
            children,
            {
                strings,
                loaded,
                workspace,
                members,
                reports,
                day
            }
        )
    );
}

export default DailyReportsViewModel;