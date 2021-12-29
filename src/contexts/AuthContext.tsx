import { createContext, FC, useCallback, useEffect, useMemo, useState } from "react";
import ProfileClient from "../infrastructure/clients/identity-server/ProfileClient";
import AuthResult from "../models/auth/AuthResult";
import Profile from "../models/profile/Profile";
import User from "../models/profile/User";
import * as TokenStorage from '../utils/TokenStorage';

export interface IAuthContext {
    user?: Profile,
    authenticated: boolean,
    authenticate: (data: AuthResult) => void
}

export const AuthContext = createContext<IAuthContext>({ authenticate: (d) => {}, authenticated: false });

export const AuthProvider: FC = ({ children }) => {
    const [user, setUser] = useState<User|undefined>();
    const [token, setToken] = useState<string|undefined|null>();
    const authenticated: boolean = useMemo(() => token != null, [token]);

    const authenticate = useCallback((data: AuthResult) => {
        setUser(data.user);
        setToken(data.token?.accessToken);
        TokenStorage.saveAccessToken(data.token?.accessToken);
    }, []);

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
        <AuthContext.Provider value={{ user, authenticate, authenticated }}>
            {children}
        </AuthContext.Provider>
    );
}