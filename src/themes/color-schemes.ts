export type ColorScheme = {
    primary: string,
    primaryText: string,
    secondary: string,
    secondaryText: string
}

export const Sea: ColorScheme ={
    primary: '#2de0dd',
    primaryText: '#f8f9fa',
    secondary: '#25bab8',
    secondaryText: '#f8f9fa'
}

export const Desk: ColorScheme ={
    primary: '#C7976E',
    primaryText: '#222',
    secondary: '#b88254',
    secondaryText: '#222'
}

export const Grassland: ColorScheme ={
    primary: '#fa32df',
    primaryText: '#f8f9fa',
    secondary: '#d92bc1',
    secondaryText: '#f8f9fa'
}

export const Unicorn: ColorScheme ={
    primary: '#04c259',
    primaryText: '#f8f9fa',
    secondary: '#0a8f45',
    secondaryText: '#f8f9fa'
}

export const NightModeStorageKey: string = process.env.REACT_APP_NIGHT_MODE_KEY ?? 'night-mode';