import { ThemeOptions } from "@mui/material";

const common: ThemeOptions = {
    spacing: 5,
    typography: {
        fontFamily: '\'Open Sans\', sans-serif'
    },
    palette: {
        error: {
            main: '#d4333e',
            contrastText: '#f8f9fa'
        },
        warning: {
            main: '#f5ac25',
            contrastText: '#f8f9fa'
        },
        info: {
            main: '#0084f0',
            contrastText: '#f8f9fa'
        }
    }
}


const buildThemeOptions: (base: ThemeOptions, variant: ThemeOptions) => ThemeOptions = (base: ThemeOptions, variant: ThemeOptions) => ({
    ...common,
    ...base,
    ...variant,
    palette: {
        ...common.palette,
        ...base.palette,
        ...variant.palette
    },
    components: {
        ...common.components,
        ...base.components,
        ...variant.components,
    }
})

const light: ThemeOptions = {
    palette: {
        background: {
            default: '#f6f7f8',
            paper: '#fff'
        },
        text: {
            primary: '#222',
            secondary: '#666',
            disabled: '#aaa',
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#f6f7f8',
                    color: '#222'
                }
            }
        }
    }
}

const dark: ThemeOptions = {
    palette: {
        background: {
            default: '#555',
            paper: '#888'
        },
        text: {
            primary: '#f8f9fa',
            secondary: '#f0f1f2',
            disabled: '#e5e6e7',
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#555',
                    color: '#f8f9fa'
                }
            }
        }
    }
}

const sea: ThemeOptions = {
    palette: {
        primary: {
            main: '#2de0dd',
            contrastText: '#f8f9fa'
        },
        secondary: {
            main: '#25bab8',
            contrastText: '#f8f9fa'
        }
    }
}

const desk: ThemeOptions = {
    palette: {
        primary: {
            main: '#C7976E',
            contrastText: '#222'
        },
        secondary: {
            main: '#b88254',
            contrastText: '#222'
        }
    }
}

const unicorn: ThemeOptions = {
    palette: {
        primary: {
            main: '#fa32df',
            contrastText: '#f8f9fa'
        },
        secondary: {
            main: '#d92bc1',
            contrastText: '#f8f9fa'
        }
    }
}

const grassland: ThemeOptions = {
    palette: {
        primary: {
            main: '#04c259',
            contrastText: '#f8f9fa'
        },
        secondary: {
            main: '#0a8f45',
            contrastText: '#f8f9fa'
        }
    }
}


export const SeaLight: ThemeOptions = buildThemeOptions(sea, light);
export const SeaDark: ThemeOptions = buildThemeOptions(sea, dark);
export const DeskLight: ThemeOptions = buildThemeOptions(desk, light);
export const DeskDark: ThemeOptions = buildThemeOptions(desk, dark);
export const UnicornLight: ThemeOptions = buildThemeOptions(unicorn, light);
export const UnicornDark: ThemeOptions = buildThemeOptions(unicorn, dark);
export const GrasslandLight: ThemeOptions = buildThemeOptions(grassland, light);
export const GrasslandDark: ThemeOptions = buildThemeOptions(grassland, dark);
