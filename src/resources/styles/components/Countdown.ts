import { Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    label: {
        fontSize: '3rem',
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightBold
    },
    passed: {
        color: theme.palette.error.main
    },
    nearlyEnd: {
        color: theme.palette.warning.main
    }
}));

export default styleSheet;