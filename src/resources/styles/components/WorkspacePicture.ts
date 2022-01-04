import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    content: {
        width: 256,
        height: 256,
    },
    alternative: {
        backgroundColor: theme.palette.grey[400],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        color: theme.palette.grey[300],
        fontSize: '3rem',
        fontWeight: theme.typography.fontWeightBold
    }
}));

export default styleSheet;