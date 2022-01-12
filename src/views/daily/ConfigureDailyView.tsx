import ConfigureDailyPage from "../../pages/daily/ConfigureDailyPage";
import ConfigureDailyViewModel from "../../view-models/daily/ConfigureDailyViewModel";

const ConfigureDailyView = () => {
    return (
        <ConfigureDailyViewModel>
            <ConfigureDailyPage />
        </ConfigureDailyViewModel>
    );
}

export default ConfigureDailyView;