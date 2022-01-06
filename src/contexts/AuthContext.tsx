import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import WorkspaceRole from "../extension/WorkspaceRole";
import ProfileClient from "../infrastructure/clients/identity-server/ProfileClient";
import AuthResult from "../models/auth/AuthResult";
import Profile from "../models/profile/Profile";
import User from "../models/profile/User";
import { NightModeStorageKey } from "../themes/color-schemes";
import * as TokenStorage from '../utils/TokenStorage';
import { SettingsContext } from "./SettingsContext";

export interface IAuthContext {
    user?: Profile,
    workspaceRoles: string[],
    setWorkspaceRoles: (roles: string[]) => void,
    authenticated: boolean,
    authenticate: (data: AuthResult) => void,
    deauthenticate: () => void,
    hasRole: (role: WorkspaceRole) => boolean
}

export const AuthContext = createContext<IAuthContext>({
    authenticate: (d) => {}, 
    deauthenticate: () => {}, 
    authenticated: false,
    workspaceRoles: [],
    setWorkspaceRoles: (_) => {},
    hasRole: (_) => false
});

export const AuthProvider: FC = ({ children }) => {
    const [user, setUser] = useState<User|undefined>();
    const [token, setToken] = useState<string|undefined|null>(TokenStorage.getAccessToken());
    const [workspaceRoles, setWorkspaceRoles] = useState<string[]>([]);
    const authenticated: boolean = useMemo(() => token != null, [token]);
    const { setNightMode } = useContext(SettingsContext);

    const authenticate = useCallback((data: AuthResult) => {
        setUser(data.user);
        setToken(data.token?.accessToken);
        TokenStorage.saveAccessToken(data.token?.accessToken);
        if (data.user?.settings?.nightMode != null) {
            setNightMode(data.user.settings.nightMode);
            localStorage.setItem(NightModeStorageKey, data.user.settings.nightMode ? '1' : '0')
        }
    }, []);

    const deauthenticate = useCallback(() => {
        setUser(undefined);
        setToken(null);
        TokenStorage.clearAccessToken();
    }, []);

    const hasRole = useCallback(
        (role: WorkspaceRole) => 
            workspaceRoles.find((workspaceRole: string) => WorkspaceRole[role] === workspaceRole) != null,
        [workspaceRoles]
    );

    useEffect(() => {
        if (TokenStorage.getAccessToken() != null) {
            setToken(TokenStorage.getAccessToken());
            const client = new ProfileClient();
            client.getCurrentUserProfile()
                .then(user => setUser(user))
                .catch(() => {
                    TokenStorage.clearAccessToken();
                });
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user, 
            authenticate, 
            authenticated, 
            workspaceRoles, 
            setWorkspaceRoles,
            hasRole,
            deauthenticate
        }}>
            {children}
        </AuthContext.Provider>
    );
}