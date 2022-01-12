import { LocalizationProvider  } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material"
import { SnackbarProvider } from "notistack";
import { useContext } from "react";
import TopBar, { MenuTrigger } from "./components/TopBar";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsContext } from "./contexts/SettingsContext";
import { StringsProvider } from "./contexts/StringsContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import AppRouter from "./routings/AppRouter";
import { SeaDark, SeaLight } from "./themes";

const App = () => {
    const { theme } = useContext(SettingsContext);
    return (
        <ThemeProvider theme={theme}>
            <StyledEngineProvider injectFirst>
                <CssBaseline>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <SnackbarProvider>
                            <StringsProvider>
                                <AuthProvider>
                                    <WorkspaceProvider>
                                        <AppRouter />
                                    </WorkspaceProvider>
                                </AuthProvider>
                            </StringsProvider>
                        </SnackbarProvider>
                    </LocalizationProvider>
                </CssBaseline>
            </StyledEngineProvider>
        </ThemeProvider>
    );
}

export default App;
