import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material"
import { SnackbarProvider } from "notistack";
import { useContext } from "react";
import TopBar, { MenuTrigger } from "./components/TopBar";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsContext } from "./contexts/SettingsContext";
import { StringsProvider } from "./contexts/StringsContext";
import AppRouter from "./routings/AppRouter";
import { SeaDark, SeaLight } from "./themes";

const App = () => {
    const { theme } = useContext(SettingsContext);
    return (
        <ThemeProvider theme={theme}>
            <StyledEngineProvider injectFirst>
                <CssBaseline>
                    <SnackbarProvider>
                        <StringsProvider>
                            <AuthProvider>
                                <TopBar />
                                <AppRouter />
                            </AuthProvider>
                        </StringsProvider>
                    </SnackbarProvider>
                </CssBaseline>
            </StyledEngineProvider>
        </ThemeProvider>
    );
}

export default App;
