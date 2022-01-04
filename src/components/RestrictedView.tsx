import { ReactElement, useContext, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getAccessToken } from "../utils/TokenStorage";
import ConditionalView from "./ConditionalView";
import paths from '../routings/paths.json';

export type Props = {
    children: ReactElement
}

const RestrictedView = ({ children }: Props) => {
    const { authenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!authenticated) {
            navigate(paths.auth.login);
        }
    }, [authenticated, navigate]);
    return (
        <ConditionalView condition={authenticated}>
            {children}
        </ConditionalView>
    );
}

export default RestrictedView;