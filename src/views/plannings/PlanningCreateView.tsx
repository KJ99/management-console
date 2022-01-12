import PlanningCreatePage from "../../pages/plannings/PlanningCreatePage";
import PlanningCreateViewModel from "../../view-models/plannings/PlanningCreateViewModel";

const PlanningCreateView = () => (
    <PlanningCreateViewModel>
        <PlanningCreatePage />
    </PlanningCreateViewModel>
);

export default PlanningCreateView;