import IncomingPlanningsPage from "../../pages/plannings/IncomingPlanningsPage";
import IncomingPlanningsViewModel from "../../view-models/plannings/IncomingPlanningsViewModel";

const IncomingPlanningsView = () => (
    <IncomingPlanningsViewModel>
        <IncomingPlanningsPage />
    </IncomingPlanningsViewModel>
);

export default IncomingPlanningsView;
