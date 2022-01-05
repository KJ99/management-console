import { useSnackbar } from "notistack";
import { Fragment, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import NavDrawer from "../components/nav/NavDrawer";
import { AuthContext } from "../contexts/AuthContext";
import { SettingsContext } from "../contexts/SettingsContext";
import { StringsContext } from "../contexts/StringsContext";
import WorkspaceRole from "../extension/WorkspaceRole";
import WorkspaceTheme from "../extension/WorkspaceTheme";
import MembersClient from "../infrastructure/clients/teams-api/MembersClient";
import TeamsClient from "../infrastructure/clients/teams-api/TeamsClient";
import Team from "../models/team/Team";
import styleSheet from "../resources/styles/views/WorkspaceDashboard";
import paths from '../routings/paths.json';

const WorkspaceDashboard = () => {
    const classes = styleSheet();
    const { user, setWorkspaceRoles } = useContext(AuthContext);
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
        if (workspace != null && user != null) {
            const client = new MembersClient();
            client.get(workspace.id!, user.id!)
                .then(member => {
                    const codes: string[] = member?.roles != null ? member.roles.map(role => role.code ?? '') : [];
                    setWorkspaceRoles(codes);
                })
                .catch(() => {
                    enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' });
                    navigate(paths.app.workspaces.index);
                })
        }
    }, [workspace, user, setWorkspaceRoles, enqueueSnackbar, navigate])

    useEffect(() => {
        if(workspace != null) {
            setWorkspaceTheme(workspace.settings?.theme ?? WorkspaceTheme.SEA);
        }
    }, [setWorkspaceTheme, workspace]);

    return (
        <Fragment>
            <NavDrawer workspace={workspace} />
            <section className={classes.wrapper}>
                <Outlet />
            </section>
        </Fragment>
    );
}

export default WorkspaceDashboard;