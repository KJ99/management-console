import { ThemeOptions } from "@mui/material";
import * as ColorSchemes from './color-schemes';

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
                '*': {
                },
                body: {
                    backgroundColor: '#f6f7f8',
                    color: '#222'
                },
                a: {
                    textDecoration: 'none',
                    color: 'inherit'
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
            main: ColorSchemes.Sea.primary,
            contrastText: ColorSchemes.Sea.primaryText
        },
        secondary: {
            main: ColorSchemes.Sea.secondary,
            contrastText: ColorSchemes.Sea.secondaryText
        }
    }
}

const desk: ThemeOptions = {
    palette: {
        primary: {
            main: ColorSchemes.Desk.primary,
            contrastText: ColorSchemes.Desk.primaryText
        },
        secondary: {
            main: ColorSchemes.Desk.secondary,
            contrastText: ColorSchemes.Desk.secondaryText
        }
    }
}

const unicorn: ThemeOptions = {
    palette: {
        primary: {
            main: ColorSchemes.Unicorn.primary,
            contrastText: ColorSchemes.Unicorn.primaryText
        },
        secondary: {
            main: ColorSchemes.Unicorn.secondary,
            contrastText: ColorSchemes.Unicorn.secondaryText
        }
    }
}

const grassland: ThemeOptions = {
    palette: {
        primary: {
            main: ColorSchemes.Grassland.primary,
            contrastText: ColorSchemes.Grassland.primaryText
        },
        secondary: {
            main: ColorSchemes.Grassland.secondary,
            contrastText: ColorSchemes.Grassland.secondaryText
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
