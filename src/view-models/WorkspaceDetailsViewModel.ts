import { Children, cloneElement, useCallback, useContext } from "react";
import { StringsContext } from "../contexts/StringsContext";
import TeamsClient from "../infrastructure/clients/teams-api/TeamsClient";
import { ViewModelProps } from "./ViewModelProps";

const client = new TeamsClient();

const WorkspaceDetailsViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    return Children.only(
        cloneElement(
            children,
            {
                strings
            }
        )
    );
}

export default WorkspaceDetailsViewModel;