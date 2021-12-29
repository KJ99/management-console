import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material"
import { SnackbarProvider } from "notistack";
import TopBar, { MenuTrigger } from "./components/TopBar";
import { AuthProvider } from "./contexts/AuthContext";
import { StringsProvider } from "./contexts/StringsContext";
import AppRouter from "./routings/AppRouter";
import { SeaLight } from "./themes";

const App = () => {
    return (
        <ThemeProvider theme={createTheme(SeaLight)}>
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
