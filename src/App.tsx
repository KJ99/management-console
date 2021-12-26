import { createTheme, CssBaseline, StyledEngineProvider, Theme, ThemeOptions, ThemeProvider, Typography } from "@mui/material"
import AuthClient from "./infrastructure/clients/identity-server/AuthClient";
import PlanningItemsClient from "./infrastructure/clients/planning-poker/PlanningItemsClient";
import PlanningsClient from "./infrastructure/clients/planning-poker/PlanningsClient";
import MembersClient from "./infrastructure/clients/teams-api/MembersClient";
import PlanningItemsImportModel from "./models/planning/PlanningItemsImportModel";
import PlanningItemUpdateModel from "./models/planning/PlanningItemUpdateModel";
import PlanningUpdateModel from "./models/planning/PlanningUpdateModel";
import { SeaLight } from "./themes";

const App = () => {
    const handleLogin = () => {
        const client = new AuthClient();
        client.login({ username: 'testuser50', password: 'P@ssw0rd' }).then(res => console.log(res.token))
    }

    const execute = () => {
    }

    return (
        <ThemeProvider theme={createTheme(SeaLight)}>
            <StyledEngineProvider injectFirst>
                <CssBaseline>
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={execute}>Execute</button>
                </CssBaseline>
            </StyledEngineProvider>
        </ThemeProvider>
    );
}

export default App;
