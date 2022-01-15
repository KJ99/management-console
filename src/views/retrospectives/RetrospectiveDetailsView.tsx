import RetrospectiveDetailsPage from "../../pages/retrospectives/RetrospectiveDetailsPage";
import RetrospectiveDetailsViewModel from "../../view-models/retrospectives/RetrospectiveDetailsViewModel";

const RetrospectiveDetailsView = () => (
    <RetrospectiveDetailsViewModel>
        <RetrospectiveDetailsPage />
    </RetrospectiveDetailsViewModel>
);

export default RetrospectiveDetailsView;
