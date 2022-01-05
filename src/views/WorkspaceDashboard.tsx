import { useSnackbar } from "notistack";
import { Fragment, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import NavDrawer from "../components/nav/NavDrawer";
import { SettingsContext } from "../contexts/SettingsContext";
import { StringsContext } from "../contexts/StringsContext";
import WorkspaceTheme from "../extension/WorkspaceTheme";
import TeamsClient from "../infrastructure/clients/teams-api/TeamsClient";
import Team from "../models/team/Team";
import paths from '../routings/paths.json';

const WorkspaceDashboard = () => {
    const { workspaceId } = useParams();
    const [workspace, setWorkspace] = useState<Team|undefined>();
    const { setWorkspaceTheme } = useContext(SettingsContext);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { strings } = useContext(StringsContext);

    useEffect(() => {
        const client = new TeamsClient();
        client.getTeam(parseInt(workspaceId ?? '-1'))
            .then((workspace) => setWorkspace(workspace))
            .catch(() => {
                enqueueSnackbar(strings('/workspaces/not-found'), { variant: 'error' });
                navigate(paths.app.workspaces.index);
            });
    }, [workspaceId, enqueueSnackbar, navigate]);

    useEffect(() => {
        if(workspace != null) {
            setWorkspaceTheme(workspace.settings?.theme ?? WorkspaceTheme.SEA);
        }
    }, [setWorkspaceTheme, workspace]);

    return (
        <Fragment>
            <NavDrawer workspace={workspace} />
            <Outlet />
        </Fragment>
    );
}

export default WorkspaceDashboard;