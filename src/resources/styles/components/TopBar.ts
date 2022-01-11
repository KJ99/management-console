import { Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.paper,
        height: 64,
        position: 'fixed',
        top: 0,
        width: '100vw',
        zIndex: 150,
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
        height: 64,
        display: 'flex',
        alignItems: 'center'
    },
    logo: {
        height: 48,
        width: 48,
        borderRadius: '50%',
        objectFit: 'cover',
    },
    menuItem: {
        padding: theme.spacing(2)
    }
}));

export default styleSheet;