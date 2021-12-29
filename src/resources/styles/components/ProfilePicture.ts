import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { fontSize } from "@mui/system";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    root: {
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main
    },
    image: {
        borderRadius: '50%',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        cursor: 'pointer'
    },
    avatar: {
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
    },
    initials: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: 'inherit',
        margin: 0,
        textAlign: 'center'
    },
    small: {
        width: 24,
        height: 24,
        fontSize: '1rem'
    },
    normal: {
        width: 48,
        height: 48,
        fontSize: '1.75rem'
    },
    large: {
        width: 64,
        height: 64,
        fontSize: '2.5rem'
    }
}));

export default styleSheet;