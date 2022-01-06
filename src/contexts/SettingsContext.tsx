import { createTheme, Theme, ThemeOptions } from "@mui/material";
import { createContext, FC, useEffect, useMemo, useState } from "react";
import WorkspaceTheme from "../extension/WorkspaceTheme";
import * as Themes from '../themes';
import { NightModeStorageKey } from "../themes/color-schemes";

export interface ISettingsContext {
    workspaceTheme: WorkspaceTheme;
    setWorkspaceTheme: (theme: WorkspaceTheme) => void;
    nightMode: boolean;
    setNightMode: (nightMode: boolean) => void;
    theme: Theme;
}

export const SettingsContext = createContext<ISettingsContext>({
    workspaceTheme: WorkspaceTheme.SEA,
    nightMode: false,
    setWorkspaceTheme: () => {},
    setNightMode: () => {},
    theme: createTheme(Themes.SeaLight)
});


const resolveApplicationTheme = (workspaceTheme: any, nightMode: boolean): Theme => {
    let options;
    switch (WorkspaceTheme[workspaceTheme]) {
        case WorkspaceTheme[WorkspaceTheme.DESK]:
            options = nightMode ? Themes.DeskDark : Themes.DeskLight;
            break;
        case WorkspaceTheme[WorkspaceTheme.GRASSLAND]:
            options = nightMode ? Themes.GrasslandDark : Themes.GrasslandLight;
            break;
        case WorkspaceTheme[WorkspaceTheme.UNICORN]:
            options = nightMode ? Themes.UnicornDark : Themes.UnicornLight;
            break;
        default:
            options = nightMode ? Themes.SeaDark : Themes.SeaLight;
            break;
    }
    return createTheme(options);
}

export const SettingsProvider: FC = ({ children }) => {
    const [workspaceTheme, setWorkspaceTheme] = useState(WorkspaceTheme.SEA);
    const [nightMode, setNightMode] = useState(parseInt(localStorage.getItem(NightModeStorageKey) ?? '0') > 0);
    const theme = useMemo(() => {
        return resolveApplicationTheme(WorkspaceTheme[workspaceTheme], nightMode);
    }, [workspaceTheme, nightMode]);

    return (
        <SettingsContext.Provider value={{
            workspaceTheme,
            setWorkspaceTheme,
            nightMode,
            setNightMode,
            theme
        }}>
            {children}
        </SettingsContext.Provider>
    );
}
