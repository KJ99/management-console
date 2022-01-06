import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import WorkspaceTheme from "../extension/WorkspaceTheme";
import MembersClient from "../infrastructure/clients/teams-api/MembersClient";
import TeamsClient from "../infrastructure/clients/teams-api/TeamsClient";
import Team from "../models/team/Team";
import strings from "../resources/strings";
import { SettingsContext } from "./SettingsContext";

export interface IWorkspaceContext {
    workspace?: Team;
    setWorkspace: (team: Team) => void,
    clearWorkspace: () => void
}

export const WorkspaceContext = createContext<IWorkspaceContext>({
    setWorkspace: () => {},
    clearWorkspace: () => {}
});

export const WorkspaceProvider: FC = ({ children }) => {
    const [workspace, setWorkspace] = useState<Team|undefined>(undefined);
    const clearWorkspace = useCallback(() => setWorkspace(undefined), []);
    const { setWorkspaceTheme } = useContext(SettingsContext);

    useEffect(() => {
        setWorkspaceTheme(workspace?.settings?.theme ?? WorkspaceTheme.SEA);
    }, [setWorkspaceTheme, workspace]);

    return (
        <WorkspaceContext.Provider value={{ workspace, setWorkspace, clearWorkspace }}>
            {children}
        </WorkspaceContext.Provider>
    )
}