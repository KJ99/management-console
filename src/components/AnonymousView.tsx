import { ReactElement, useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getAccessToken } from "../utils/TokenStorage";
import ConditionalView from "./ConditionalView";
import paths from '../routings/paths.json';

export type Props = {
    children: ReactElement
}

const AnonymousView = ({ children }: Props) => {
    const { authenticated } = useContext(AuthContext);
    return (
        <ConditionalView condition={getAccessToken() == null}>
            {children}
        </ConditionalView>
    );
}

export default AnonymousView;