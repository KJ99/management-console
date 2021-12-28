import { createContext, FC, useCallback, useMemo, useState } from "react";
import AuthResult from "../models/auth/AuthResult";
import Profile from "../models/profile/Profile";
import User from "../models/profile/User";
import * as TokenStorage from '../utils/TokenStorage';

export interface IAuthContext {
    user?: Profile,
    authenticated?: boolean,
    authenticate: (data: AuthResult) => void
}

export const AuthContext = createContext<IAuthContext>({ authenticate: (d) => {} });

export const AuthProvider: FC = ({ children }) => {
    const authenticated: boolean = useMemo(() => TokenStorage.getAccessToken() != null, []);
    const [user, setUser] = useState<User|undefined>();
    const authenticate = useCallback((data: AuthResult) => {
        setUser(data.user);
        TokenStorage.saveAccessToken(data.token?.accessToken);
    }, []);

    return (
        <AuthContext.Provider value={{ user, authenticate, authenticated }}>
            {children}
        </AuthContext.Provider>
    );
}