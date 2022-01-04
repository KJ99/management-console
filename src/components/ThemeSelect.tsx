import { Box, ButtonBase, FormControlProps, FormHelperText, FormLabel, Grid, Typography } from "@mui/material"
import { CSSProperties } from "react";
import WorkspaceTheme from "../extension/WorkspaceTheme";
import { v4 } from 'uuid';
import * as ColorSchemes from '../themes/color-schemes';

import {
    SeaLight,
    DeskLight,
    GrasslandLight,
    UnicornLight
} from '../themes';
import styleSheet from "../resources/styles/components/ThemeSelect";
import clsx from "clsx";

type Option = {
    label: string,
    value: string,
    color: string
}

const options: Option[] = [
    {
        label: `/themes/sea`,
        value: WorkspaceTheme[WorkspaceTheme.SEA],
        color: ColorSchemes.Sea.primary
    },
    {
        label: `/themes/desk`,
        value: WorkspaceTheme[WorkspaceTheme.DESK],
        color: ColorSchemes.Desk.primary
    },
    {
        label: `/themes/grassland`,
        value: WorkspaceTheme[WorkspaceTheme.GRASSLAND],
        color: ColorSchemes.Grassland.primary
    },
    {
        label: `/themes/unicorn`,
        value: WorkspaceTheme[WorkspaceTheme.UNICORN],
        color: ColorSchemes.Unicorn.primary
    },
]

export type Props = {
    value?: string,
    onChange: (evt: any) => void,
    error: boolean,
    helperText?: any,
    strings: (name: string, ...args: any[]) => string
}

const ThemeSelect = ({
    onChange,
    error,
    helperText,
    strings,
    value
}: Props) => {
    const classes = styleSheet();
    return (
        <Box>
            <FormLabel>{strings('/themes/select')}</FormLabel>
            <Grid container spacing={1}>
                {options.map((theme) => (
                    <Grid item key={v4()}>
                        <ButtonBase onClick={() => onChange(theme.value)}>
                            <Box className={clsx(classes.option, {
                                [classes.active]: value === theme.value
                            })}>
                                <div 
                                    className={classes.colorPreview} 
                                    style={{ backgroundColor: theme.color }} 
                                />
                                <Typography className={classes.name}>
                                    {strings(theme.label)}
                                </Typography>
                            </Box>
                        </ButtonBase>
                    </Grid>
                ))}
            </Grid>
            <FormHelperText error={error}>
                {helperText}
            </FormHelperText>
        </Box>
    );
}

ThemeSelect.defaultProps = {
    value: null,
    onChange: (evt: any) => {},
    error: false,
    helperText: null
}

export default ThemeSelect;