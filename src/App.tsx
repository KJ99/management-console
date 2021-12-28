import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material"
import { StringsProvider } from "./contexts/StringsContext";
import { SeaLight } from "./themes";

const App = () => {
    return (
        <ThemeProvider theme={createTheme(SeaLight)}>
            <StyledEngineProvider injectFirst>
                <CssBaseline>
                    <StringsProvider>
                    </StringsProvider>
                </CssBaseline>
            </StyledEngineProvider>
        </ThemeProvider>
    );
}

export default App;
