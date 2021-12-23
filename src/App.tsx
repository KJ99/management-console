import { createTheme, CssBaseline, StyledEngineProvider, Theme, ThemeOptions, ThemeProvider, Typography } from "@mui/material"
import { useEffect } from "react";
import { SeaLight } from "./themes";

const App = () => {
    useEffect(() => {
        fetch('https://localhost:8443/v1/profile/abc');
    }, []);
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
