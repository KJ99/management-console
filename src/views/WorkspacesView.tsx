import WorkspacesPage from "../pages/WorspacesPage";
import WorkspacesViewModel from "../view-models/WorkspacesViewModel";

const WorkspacesView = () => {
    return (
        <WorkspacesViewModel>
            <WorkspacesPage />
        </WorkspacesViewModel>
    );
}

export default WorkspacesView;