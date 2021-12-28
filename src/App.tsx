import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material"
import TopBar, { MenuTrigger } from "./components/TopBar";
import { AuthProvider } from "./contexts/AuthContext";
import { StringsProvider } from "./contexts/StringsContext";
import { SeaLight } from "./themes";

const App = () => {
    return (
        <ThemeProvider theme={createTheme(SeaLight)}>
            <StyledEngineProvider injectFirst>
                <CssBaseline>
                    <StringsProvider>
                        <AuthProvider>
                            <TopBar />
                        </AuthProvider>
                    </StringsProvider>
                </CssBaseline>
            </StyledEngineProvider>
        </ThemeProvider>
    );
}

export default App;
