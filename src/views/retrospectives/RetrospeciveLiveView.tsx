import RetrospectiveLivePage from "../../pages/retrospectives/RetrospectiveLivePage";
import RetrospectiveLiveViewModel from "../../view-models/retrospectives/RetrospectiveLiveViewModel";

const RetrospectiveLiveView = () => (
    <RetrospectiveLiveViewModel>
        <RetrospectiveLivePage />
    </RetrospectiveLiveViewModel>
)

export default RetrospectiveLiveView;
