import PlanningDetailsPage from "../../pages/plannings/PlanningDetailsPage";
import PlanningDetailsViewModel from "../../view-models/plannings/PlanningDetailsViewModel";

const PlanningDetailsView = () => (
    <PlanningDetailsViewModel>
        <PlanningDetailsPage />
    </PlanningDetailsViewModel>
);

export default PlanningDetailsView;
