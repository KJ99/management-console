import WorkspaceDetailsPage from "../pages/WorkspaceDetailsPage";
import WorkspaceDetailsViewModel from "../view-models/WorkspaceDetailsViewModel";

const WorkspaceDetailsView = () => {
    return (
        <WorkspaceDetailsViewModel>
            <WorkspaceDetailsPage />
        </WorkspaceDetailsViewModel>
    );
}

export default WorkspaceDetailsView;