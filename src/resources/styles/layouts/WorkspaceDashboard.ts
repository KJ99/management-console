import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    wrapper: {
        [theme.breakpoints.up('md')]: {
            marginLeft: 256
        }
    },
    breadcrumbsItem: {
        color: theme.palette.text.secondary,
        textDecoration: 'none'
    },
    currentBreadcrumbsItem: {
        color: theme.palette.text.primary
    },
    pageTitle: {
        fontSize: '1.2rem',
        fontWeight: theme.typography.fontWeightMedium,
        marginTop: theme.spacing(3)
    },
    pageHeader: {
        marginBottom: theme.spacing(5),
        display: 'flex',
        flexWrap: 'wrap'
    },
    pageTitleArea: {
        flex: 1,
        minWidth: 205
    },
    pageActionsArea: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        [theme.breakpoints.up('md')]: {
            justifyContent: 'flex-end'
        },
        [theme.breakpoints.down('md')]: {
            justifyContent: 'center'
        }
    },
    pageAction: {
        margin: theme.spacing(2)
    }
}));

export default styleSheet;