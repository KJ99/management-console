import { Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    root: {
    },
    header: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'capitalize'
    },
    title: {
        color: theme.palette.primary.contrastText,
        fontSize: '1.5rem',
        fontWeight: theme.typography.fontWeightBold
    },
    note: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center'
    },
    noteMedia: {
        width: 96,
        height: 96,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    noteTitle: {
        fontWeight: theme.typography.fontWeightBold,
        marginBottom: theme.spacing(1)
    },
    noteContent: {
    }
}));

export default styleSheet;