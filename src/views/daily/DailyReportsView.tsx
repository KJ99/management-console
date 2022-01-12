import DailyReportsPage from "../../pages/daily/DailyReportsPage";
import DailyReportsViewModel from "../../view-models/daily/DailyReportsViewModel";

const DailyReportsView = () => (
    <DailyReportsViewModel>
        <DailyReportsPage />
    </DailyReportsViewModel>
);

export default DailyReportsView;