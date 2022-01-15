import ActionItemsPage from "../../pages/retrospectives/ActionItemsPage";
import ActionItemsViewModel from "../../view-models/retrospectives/ActionItemsViewModel";

const ActionItemsView = () => (
    <ActionItemsViewModel>
        <ActionItemsPage />
    </ActionItemsViewModel>
);

export default ActionItemsView;
