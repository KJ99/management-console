import { ReactElement, useCallback, useContext, useEffect, useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getAccessToken } from "../utils/TokenStorage";
import ConditionalView from "./ConditionalView";
import paths from '../routings/paths.json';
import WorkspaceRole from "../extension/WorkspaceRole";

export type Props = {
    children: ReactElement,
    permittedRoles?: WorkspaceRole[],
    forbiddenRoles?: WorkspaceRole[],
}

const RestrictedView = ({ children, permittedRoles, forbiddenRoles }: Props) => {
    const { authenticated, hasRole } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authenticated) {
            navigate(paths.auth.login);
        }
    }, [authenticated, navigate]);

    const verifyPermittedRoles = useCallback(() => {
        let result = permittedRoles == null;
        if (permittedRoles != null) {
            for (let i = 0; i < permittedRoles.length && !result; i++) {
                if (hasRole(permittedRoles[i])) {
                    result = true;
                }
            }
        }
        return result;
    }, [permittedRoles, hasRole]);

    const verifyForbiddenRoles = useCallback(() => {
        let result = true;
        if (forbiddenRoles != null) {
            for (let i = 0; i < forbiddenRoles.length && result; i++) {
                if (hasRole(forbiddenRoles[i])) {
                    result = false;
                }
            }
        }
        return result;
    }, [forbiddenRoles, hasRole]);

    const hasAccess = useMemo(
        () => authenticated && verifyPermittedRoles() && verifyForbiddenRoles(),
        [authenticated, verifyPermittedRoles, verifyForbiddenRoles]
    );
    return (
        <ConditionalView condition={hasAccess}>
            {children}
        </ConditionalView>
    );
}

export default RestrictedView;