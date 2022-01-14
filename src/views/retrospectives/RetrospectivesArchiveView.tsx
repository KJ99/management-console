import RetrospectivesArchivePage from "../../pages/retrospectives/RetrospectivesArchivePage";
import RetrospectivesArchiveViewModel from "../../view-models/retrospectives/RetrospectivesArchiveViewModel";

const RetrospectivesArchiveView = () => (
    <RetrospectivesArchiveViewModel>
        <RetrospectivesArchivePage />
    </RetrospectivesArchiveViewModel>
);

export default RetrospectivesArchiveView;
