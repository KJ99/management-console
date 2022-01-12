import DailyArchivePage from "../../pages/daily/DailyArchivePage";
import DailyArchiveViewModel from "../../view-models/daily/DailyArchiveViewModel";

const DailyArchiveView = () => (
    <DailyArchiveViewModel>
        <DailyArchivePage />
    </DailyArchiveViewModel>
);

export default DailyArchiveView;