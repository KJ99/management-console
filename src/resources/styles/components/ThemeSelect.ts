import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    option: {
        width: 70,
        height: 70,
        border: '1px solid',
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: theme.palette.grey[500],
        color: theme.palette.grey[500]
    },
    colorPreview: {
        width: 32,
        height: 32,
        marginBottom: theme.spacing(2)
    },
    active: {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main
    },
    name: {
        color: 'inherit',
        fontSize: '0.75rem'
    }
}));

export default styleSheet;