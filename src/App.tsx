import { createTheme, CssBaseline, StyledEngineProvider, Theme, ThemeOptions, ThemeProvider, Typography } from "@mui/material"
import { SeaLight } from "./themes";

const App = () => {
    return (
        <ThemeProvider theme={createTheme(SeaLight)}>
            <StyledEngineProvider injectFirst>
                <CssBaseline>
                </CssBaseline>
            </StyledEngineProvider>
        </ThemeProvider>
    );
}

export default App;
