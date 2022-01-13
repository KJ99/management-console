import PlanningsArchivePage from "../../pages/plannings/PlanningsArchivePage";
import PlanningsArchiveViewModel from "../../view-models/plannings/PlanningsArchiveViewModel";

const PlanningsArchiveView = () => (
    <PlanningsArchiveViewModel>
        <PlanningsArchivePage />
    </PlanningsArchiveViewModel>
);

export default PlanningsArchiveView;