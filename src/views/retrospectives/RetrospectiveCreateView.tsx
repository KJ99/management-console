import RetrospectiveCreatePage from "../../pages/retrospectives/RetrospectiveCreatePage";
import RetrospectiveCreateViewModel from "../../view-models/retrospectives/RetrospectiveCreateViewModel";

const RetrospectiveCreateView = () => (
    <RetrospectiveCreateViewModel>
        <RetrospectiveCreatePage />
    </RetrospectiveCreateViewModel>
);

export default RetrospectiveCreateView;
