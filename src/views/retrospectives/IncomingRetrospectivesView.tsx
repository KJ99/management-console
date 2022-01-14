import IncomingRetrospectivesPage from "../../pages/retrospectives/IncomingRetrospectivesPage";
import IncomingRetrospectivesViewModel from "../../view-models/retrospectives/IncomingRetrospectivesViewModel";

const IncomingRetrospectivesView = () => (
    <IncomingRetrospectivesViewModel>
        <IncomingRetrospectivesPage />
    </IncomingRetrospectivesViewModel>
);

export default IncomingRetrospectivesView;
