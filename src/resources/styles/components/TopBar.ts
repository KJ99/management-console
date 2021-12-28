import { Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.paper,
        height: 64,
        boxShadow: theme.shadows[1],
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: theme.spacing(3),
        paddingLeft: theme.spacing(3),
    },
    menuTriggerContainer: {
        marginRight: theme.spacing(2)
    },
    logoContainer: {
        height: 64,
        display: 'flex',
        alignItems: 'center'
    },
    profileContainer: {
        backgroundColor: 'green',
        height: 64,
    },
    logo: {
        height: 48,
        width: 48,
        borderRadius: '50%',
        objectFit: 'cover',
    }
}));

export default styleSheet;